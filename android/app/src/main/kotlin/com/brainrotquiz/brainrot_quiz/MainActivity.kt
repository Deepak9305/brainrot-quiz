package com.brainrotquiz.brainrot_quiz

import android.content.Intent
import android.speech.tts.TextToSpeech
import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.plugin.common.MethodChannel
import java.util.Locale

class MainActivity : FlutterActivity() {
    private var textToSpeech: TextToSpeech? = null
    private var ttsReady = false
    private var pendingSpeech: Triple<String, Float, Float>? = null

    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)

        MethodChannel(flutterEngine.dartExecutor.binaryMessenger, "brainrot_quiz/share")
            .setMethodCallHandler { call, result ->
                if (call.method != "shareText") {
                    result.notImplemented()
                    return@setMethodCallHandler
                }
                val text = call.argument<String>("text").orEmpty()
                val intent = Intent(Intent.ACTION_SEND).apply {
                    type = "text/plain"
                    putExtra(Intent.EXTRA_TEXT, text)
                }
                startActivity(Intent.createChooser(intent, "Share your brainrot score"))
                result.success(true)
            }

        MethodChannel(flutterEngine.dartExecutor.binaryMessenger, "brainrot_quiz/voice")
            .setMethodCallHandler { call, result ->
                when (call.method) {
                    "speak" -> {
                        val text = call.argument<String>("text").orEmpty().trim()
                        val pitch = (call.argument<Double>("pitch") ?: 1.0).toFloat()
                        val rate = (call.argument<Double>("rate") ?: 1.0).toFloat()
                        if (text.isEmpty()) {
                            result.success(false)
                            return@setMethodCallHandler
                        }
                        speak(text, pitch, rate)
                        result.success(true)
                    }
                    "stop" -> {
                        pendingSpeech = null
                        textToSpeech?.stop()
                        result.success(null)
                    }
                    else -> result.notImplemented()
                }
            }
    }

    private fun speak(text: String, pitch: Float, rate: Float) {
        val safePitch = pitch.coerceIn(0.7f, 1.4f)
        val safeRate = rate.coerceIn(0.7f, 1.35f)
        val tts = textToSpeech

        if (tts != null && ttsReady) {
            tts.stop()
            tts.setPitch(safePitch)
            tts.setSpeechRate(safeRate)
            tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, "brainrot_prompt")
            return
        }

        pendingSpeech = Triple(text, safePitch, safeRate)
        if (tts != null) return

        textToSpeech = TextToSpeech(this) { status ->
            val instance = textToSpeech ?: return@TextToSpeech
            ttsReady = status == TextToSpeech.SUCCESS
            if (!ttsReady) {
                pendingSpeech = null
                return@TextToSpeech
            }

            instance.language = Locale.US
            pendingSpeech?.let { (pendingText, pendingPitch, pendingRate) ->
                instance.setPitch(pendingPitch)
                instance.setSpeechRate(pendingRate)
                instance.speak(
                    pendingText,
                    TextToSpeech.QUEUE_FLUSH,
                    null,
                    "brainrot_prompt",
                )
                pendingSpeech = null
            }
        }
    }

    override fun onDestroy() {
        textToSpeech?.stop()
        textToSpeech?.shutdown()
        textToSpeech = null
        ttsReady = false
        super.onDestroy()
    }
}
