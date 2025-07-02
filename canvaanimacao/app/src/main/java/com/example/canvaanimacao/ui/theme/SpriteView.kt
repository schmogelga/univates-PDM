package com.example.canvaanimacao.ui.theme
import android.content.Context
import android.graphics.BitmapFactory
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.view.View
import com.example.canvaanimacao.R

class SpriteView(context: Context) : View(context), Runnable {

    private val frames = arrayOf(
        BitmapFactory.decodeResource(resources, R.drawable.frame_0),
        BitmapFactory.decodeResource(resources, R.drawable.frame_1),
        BitmapFactory.decodeResource(resources, R.drawable.frame_2),
        BitmapFactory.decodeResource(resources, R.drawable.frame_3)
    )
    private var frameIndex = 0
    private val paint = Paint()
    private var running = true
    private val frameDelay = 100L // ms
    private val thread = Thread(this)

    init {
        thread.start()
    }

    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)
        canvas.drawColor(Color.WHITE)
        canvas.drawBitmap(frames[frameIndex], 100f, 100f, paint)
    }

    override fun run() {
        while (running) {
            frameIndex = (frameIndex + 1) % frames.size
            postInvalidate()
            try {
                Thread.sleep(frameDelay)
            } catch (e: InterruptedException) {
                e.printStackTrace()
            }
        }
    }

    fun stop() {
        running = false
    }
}
