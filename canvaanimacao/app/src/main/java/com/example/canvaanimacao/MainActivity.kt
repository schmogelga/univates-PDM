package com.example.canvaanimacao

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.example.canvaanimacao.ui.theme.SpriteView

class MainActivity : AppCompatActivity() {

    private lateinit var spriteView: SpriteView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        spriteView = SpriteView(this)
        setContentView(spriteView)
    }

    override fun onDestroy() {
        super.onDestroy()
        spriteView.stop()
    }
}
