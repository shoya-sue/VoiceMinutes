export const analyzeTranscript = (transcript) => {
  const sentences = transcript.split(/[。！？\.\!\?]+/).filter(s => s.trim());
  
  // Extract topics (simple keyword extraction)
  const topics = extractTopics(sentences);
  
  // Extract action items
  const actionItems = extractActionItems(sentences);
  
  // Extract decisions
  const decisions = extractDecisions(sentences);
  
  // Identify speakers (simple heuristic)
  const speakerSegments = identifySpeakers(sentences);
  
  return {
    topics,
    actionItems,
    decisions,
    speakerSegments,
    sentences
  };
};

const extractTopics = (sentences) => {
  const topicKeywords = [
    '議題', 'テーマ', '目的', '課題', 'プロジェクト', '計画', '提案',
    '確認', '検討', '報告', '相談', '決定', '方針', '戦略'
  ];
  
  const topics = [];
  sentences.forEach(sentence => {
    topicKeywords.forEach(keyword => {
      if (sentence.includes(keyword)) {
        topics.push(sentence.trim());
      }
    });
  });
  
  return [...new Set(topics)].slice(0, 5); // Return unique topics, max 5
};

const extractActionItems = (sentences) => {
  const actionKeywords = [
    'する必要', 'してください', 'お願い', '確認して', '準備して',
    '作成', '実施', '対応', '調整', '連絡', '送付', '提出',
    'やる', 'やります', 'します', '予定', '締切', '期限'
  ];
  
  const actionItems = [];
  sentences.forEach(sentence => {
    actionKeywords.forEach(keyword => {
      if (sentence.includes(keyword)) {
        // Try to extract person and deadline
        const person = extractPerson(sentence);
        const deadline = extractDeadline(sentence);
        
        actionItems.push({
          task: sentence.trim(),
          person: person || '未定',
          deadline: deadline || '未定'
        });
      }
    });
  });
  
  return actionItems.slice(0, 10); // Max 10 action items
};

const extractDecisions = (sentences) => {
  const decisionKeywords = [
    '決定', '決まり', '承認', '合意', '確定', '採用',
    'ことにした', 'ことになった', 'ことにする', 'ことになる'
  ];
  
  const decisions = [];
  sentences.forEach(sentence => {
    decisionKeywords.forEach(keyword => {
      if (sentence.includes(keyword)) {
        decisions.push(sentence.trim());
      }
    });
  });
  
  return [...new Set(decisions)].slice(0, 5); // Return unique decisions, max 5
};

const extractPerson = (sentence) => {
  // Simple pattern matching for names (can be improved)
  const patterns = [
    /([ぁ-ん]+)さん/,
    /([ァ-ヶー]+)さん/,
    /([一-龯]+)さん/,
    /([A-Za-z]+)さん/
  ];
  
  for (const pattern of patterns) {
    const match = sentence.match(pattern);
    if (match) {
      return match[1] + 'さん';
    }
  }
  return null;
};

const extractDeadline = (sentence) => {
  // Simple pattern matching for dates (can be improved)
  const patterns = [
    /(\d+月\d+日)/,
    /(\d+\/\d+)/,
    /(今週|来週|今月|来月|明日|明後日)/,
    /(月曜|火曜|水曜|木曜|金曜|土曜|日曜)/
  ];
  
  for (const pattern of patterns) {
    const match = sentence.match(pattern);
    if (match) {
      return match[1];
    }
  }
  return null;
};

const identifySpeakers = (sentences) => {
  // Simple speaker identification (can be improved with actual speaker diarization)
  const speakers = ['話者A', '話者B', '話者C', '話者D'];
  const segments = [];
  
  sentences.forEach((sentence, index) => {
    // Assign speakers in round-robin fashion (placeholder logic)
    const speakerIndex = Math.floor(index / 3) % speakers.length;
    segments.push({
      speaker: speakers[speakerIndex],
      text: sentence.trim()
    });
  });
  
  return segments;
};

export const generateMinutes = (analysisResult, metadata = {}) => {
  const now = new Date();
  const dateStr = now.toLocaleString('ja-JP');
  
  const { topics, actionItems, decisions, speakerSegments } = analysisResult;
  
  let minutes = `# 会議議事録\n\n`;
  minutes += `## 基本情報\n`;
  minutes += `- **日時**: ${metadata.date || dateStr}\n`;
  minutes += `- **参加者**: ${metadata.participants || extractSpeakerNames(speakerSegments)}\n`;
  minutes += `- **時間**: ${metadata.duration || '不明'}\n\n`;
  
  minutes += `## 会議内容\n\n`;
  
  if (topics.length > 0) {
    minutes += `### 主な議題\n`;
    topics.forEach((topic, index) => {
      minutes += `${index + 1}. ${topic}\n`;
    });
    minutes += `\n`;
  }
  
  minutes += `### 議事詳細\n`;
  speakerSegments.forEach(segment => {
    minutes += `**${segment.speaker}**: ${segment.text}\n\n`;
  });
  
  if (actionItems.length > 0) {
    minutes += `## アクションアイテム\n`;
    actionItems.forEach(item => {
      minutes += `- [ ] ${item.task} (担当: ${item.person}, 期限: ${item.deadline})\n`;
    });
    minutes += `\n`;
  }
  
  if (decisions.length > 0) {
    minutes += `## 決定事項\n`;
    decisions.forEach((decision, index) => {
      minutes += `${index + 1}. ${decision}\n`;
    });
    minutes += `\n`;
  }
  
  minutes += `## 次回会議\n`;
  minutes += `- 日時: ${metadata.nextMeeting || '未定'}\n`;
  minutes += `- 議題: ${metadata.nextAgenda || '未定'}\n`;
  
  return minutes;
};

const extractSpeakerNames = (speakerSegments) => {
  const speakers = [...new Set(speakerSegments.map(s => s.speaker))];
  return speakers.join(', ');
};