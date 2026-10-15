  // ======= VOICEVOX ローカルエンジン呼び出し =======
  async function speakWithVoiceVox(text) {
    const speaker = document.getElementById("speaker").value || 1;

    try {
      statusEl.textContent = "状態：VOICEVOXで合成中…";

      // ① audio_query
      const queryRes = await fetch(
        `http://127.0.0.1:50021/audio_query?text=${encodeURIComponent(text)}&speaker=${encodeURIComponent(speaker)}`,
        { method: "POST" }
      );
      if (!queryRes.ok) {
        throw new Error("audio_queryに失敗しました：" + queryRes.status);
      }
      const queryJson = await queryRes.json();

      // ② synthesis
      const audioRes = await fetch(
        `http://127.0.0.1:50021/synthesis?speaker=${encodeURIComponent(speaker)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(queryJson)
        }
      );
      if (!audioRes.ok) {
        throw new Error("synthesisに失敗しました：" + audioRes.status);
      }

    const blob = await audioRes.blob();
    const url = URL.createObjectURL(blob);
    audioEl.src = url;
    try {
        await audioEl.play();
        statusEl.textContent = "状態：再生中";
    } catch (e) {
        console.warn("自動再生がブロックされました", e);
        statusEl.textContent = "状態：音声は生成されました（下の再生ボタンを押してください）";
    }

    } catch (e) {
      console.error(e);
      log("VOICEVOXエラー：" + e.message);
      statusEl.textContent = "状態：エラー（VOICEVOXエンジンが起動しているか確認してください）";
      alert("音声生成に失敗しました。\nVOICEVOXエンジンが起動しているか、ポート番号が正しいか確認してください。");
    }
  }

  // 手動でテキストをしゃべらせるボタン
  speakBtn.addEventListener("click", () => {
    const text = textArea.value.trim();
    if (!text) {
      alert("テキストが空です。");
      return;
    }
    speakWithVoiceVox(text);
  });

  function log(msg) {
    const now = new Date().toLocaleTimeString();
    logEl.textContent += `[${now}] ${msg}\n`;
  }
