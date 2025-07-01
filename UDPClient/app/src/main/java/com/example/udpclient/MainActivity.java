package com.example.udpclient

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import com.example.udpclient.ui.theme.UDPClientTheme

public class MainActivity extends AppCompatActivity {

    private GameView gameView;
    private static final String SERVER_IP = "192.168.0.100"; // Altere para o IP do servidor
    private static final int SERVER_PORT = 9876;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        gameView = new GameView(this);
        setContentView(gameView);
    }

    class GameView extends SurfaceView implements SurfaceHolder.Callback, Runnable {

        private Thread thread;
        private boolean running = true;
        private Paint paint = new Paint();
        private float myX = 100, myY = 100;
        private DatagramSocket socket;
        private Map<String, PointF> others = new ConcurrentHashMap<>();

        public GameView(Context context) {
            super(context);
            getHolder().addCallback(this);
            paint.setColor(Color.RED);
            new Thread(this::receiveLoop).start();
            try {
                socket = new DatagramSocket();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        @Override
        public void surfaceCreated(SurfaceHolder holder) {
            thread = new Thread(this);
            thread.start();
        }

        @Override public void surfaceChanged(SurfaceHolder holder, int format, int width, int height) {}
        @Override public void surfaceDestroyed(SurfaceHolder holder) { running = false; }

        @Override
        public boolean onTouchEvent(MotionEvent event) {
            if (event.getAction() == MotionEvent.ACTION_MOVE || event.getAction() == MotionEvent.ACTION_DOWN) {
                myX = event.getX();
                myY = event.getY();
                sendPosition();
                return true;
            }
            return false;
        }

        private void sendPosition() {
            try {
                String msg = myX + "," + myY;
                byte[] data = msg.getBytes();
                DatagramPacket packet = new DatagramPacket(data, data.length, InetAddress.getByName(SERVER_IP), SERVER_PORT);
                socket.send(packet);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        private void receiveLoop() {
            try {
                DatagramSocket receiveSocket = new DatagramSocket(9877); // Porta diferente para receber
                byte[] buf = new byte[1024];
                while (true) {
                    DatagramPacket packet = new DatagramPacket(buf, buf.length);
                    receiveSocket.receive(packet);
                    String msg = new String(packet.getData(), 0, packet.getLength());
                    String[] parts = msg.split(":");
                    if (parts.length == 2) {
                        String id = packet.getAddress().getHostAddress(); // Identificador IP
                        String[] xy = parts[1].split(",");
                        float x = Float.parseFloat(xy[0]);
                        float y = Float.parseFloat(xy[1]);
                        others.put(id, new PointF(x, y));
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        @Override
        public void run() {
            while (running) {
                Canvas canvas = getHolder().lockCanvas();
                if (canvas != null) {
                    canvas.drawColor(Color.BLACK);
                    canvas.drawCircle(myX, myY, 30, paint);
                    paint.setColor(Color.GREEN);
                    for (PointF p : others.values()) {
                        canvas.drawCircle(p.x, p.y, 30, paint);
                    }
                    paint.setColor(Color.RED);
                    getHolder().unlockCanvasAndPost(canvas);
                }
                try { Thread.sleep(16); } catch (InterruptedException e) {}
            }
        }
    }
}
