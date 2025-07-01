import java.net.*;
import java.util.*;

public class UdpServer {
    static Set<InetSocketAddress> clients = new HashSet<>();

    public static void main(String[] args) throws Exception {
        DatagramSocket socket = new DatagramSocket(9876);
        byte[] buf = new byte[1024];

        while (true) {
            DatagramPacket packet = new DatagramPacket(buf, buf.length);
            socket.receive(packet);

            String data = new String(packet.getData(), 0, packet.getLength());
            InetSocketAddress sender = new InetSocketAddress(packet.getAddress(), packet.getPort());
            clients.add(sender);

            String msgToSend = packet.getAddress().getHostAddress() + ":" + data;
            byte[] msgBytes = msgToSend.getBytes();

            for (InetSocketAddress client : clients) {
                if (!client.equals(sender)) {
                    DatagramPacket outPacket = new DatagramPacket(msgBytes, msgBytes.length, client.getAddress(), 9877);
                    socket.send(outPacket);
                }
            }
        }
    }
}
