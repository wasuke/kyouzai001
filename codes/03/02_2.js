 // ======= Web Speech API（音声認識）設定 =======
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition || null;
  const recBtn   = document.getElementById("recBtn");
  const speakBtn = document.getElementById("speakBtn");
  const textArea = document.getElementById("text");
  const statusEl = document.getElementById("status");
  const logEl    = document.getElementById("log");
  const audioEl  = document.getElementById("audioPlayer");
  let recognition = null;
  let recognizing = false;

  if (!SpeechRecognition) {
    statusEl.textContent = "状態：このブラウザは音声認識（Web Speech API）に対応していません。";
    recBtn.disabled = true;
  } else {
    recognition = new SpeechRecognition();
    recognition.lang = "ja-JP";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
      recognizing = true;
      statusEl.textContent = "状態：録音中…話してください";
      recBtn.textContent = "■ 入力を廃棄して録音停止";
    };

    recognition.onend = () => {
      recognizing = false;
      statusEl.textContent = "状態：待機中";
      recBtn.textContent = "🎙 録音開始";
    };

    recognition.onerror = (event) => {
      log("音声認識エラー：" + event.error);
      recognizing = false;
      statusEl.textContent = "状態：エラーが発生しました（コンソール・ログを参照）";
      recBtn.textContent = "🎙 録音開始";
    };

    recognition.onresult = async (event) => {
      const result = event.results[0][0];
      const transcript = result.transcript;
      const confidence = result.confidence;
      textArea.value = transcript;
      log("認識結果：" + transcript + "\n信頼度：" + confidence.toFixed(2));
      // 認識されたテキストをそのままVOICEVOXで発話
      speakWithVoiceVox(transcript);
    };
  }

  recBtn.addEventListener("click", () => {
    if (!recognition) return;
    if (!recognizing) {
      // 録音開始
      recognition.start();
    } else {
      // 明示的に停止
      recognition.stop();
    }
  });
