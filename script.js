let currentAudio = null;
//-----------------------------------播放音频-----------------------------------
function playAudio(src) {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
  currentAudio = new Audio(src);
  currentAudio.play();
}

//-----------------------------------统计点击事件-----------------------------------
const clickCounts = {};
let statsExpanded = false;

function recordClick(label) {
  clickCounts[label] = (clickCounts[label] || 0) + 1;
  updateStatsPanel();
}

function toggleStats() {
  statsExpanded = !statsExpanded;
  document.getElementById('toggle-button').innerText = statsExpanded ? '▲ ▲ 收起 ▲ ▲' : '▼ ▼ 展开 ▼ ▼';
  updateStatsPanel();
}

function updateStatsPanel() {
  const statsList = document.getElementById('stats-list');
  statsList.innerHTML = '';

  const sorted = Object.entries(clickCounts)
    .sort((a, b) => b[1] - a[1]) // 按次数从多到少排序
    .slice(0, statsExpanded ? 20 : 8);

  for (const [label, count] of sorted) {
    const li = document.createElement('li');
    li.textContent = `${label}: ${count}`;
    statsList.appendChild(li);
  }
}

//-----------------------------------歌单部分脚本---------------------------------
let allSongs = [];
let activeTag = "全部";
let activeKeyword = "";

async function loadSongs() {
  try {
    const res = await fetch('songlist.json');
    if (!res.ok) throw new Error(`状态码 ${res.status}`);
    allSongs = await res.json();
    populateTagOptions();
    renderSongList();
  } catch (err) {
    console.error("加载歌曲列表失败：", err);
    alert("无法加载歌单数据，请检查 songlist.json 路径和格式。");
  }
}

function populateTagOptions() {
  const allTags = new Set();
  allSongs.forEach(song => song.tags?.forEach(tag => allTags.add(tag)));

  const tagSelect = document.getElementById('tag-filter');
  allTags.forEach(tag => {
    const option = document.createElement('option');
    option.value = tag;
    option.textContent = tag;
    tagSelect.appendChild(option);
  });
}

function renderSongList() {
  const ul = document.getElementById('song-list');
  ul.innerHTML = '';

  const filtered = allSongs.filter(song => {
    const matchesKeyword = song.title.toLowerCase().includes(activeKeyword.toLowerCase());
    const matchesTag = activeTag === "全部" || (song.tags && song.tags.includes(activeTag));
    return matchesKeyword && matchesTag;
  });

  for (const song of filtered) {
    const li = document.createElement('li');
    li.innerHTML = `<a href="${song.src}" target="_blank">${song.title}</a>`;
    ul.appendChild(li);
  }
}

// 搜索监听
document.getElementById('song-search').addEventListener('input', (e) => {
  activeKeyword = e.target.value;
  renderSongList();
});

// 分组监听
document.getElementById('tag-filter').addEventListener('change', (e) => {
  activeTag = e.target.value;
  renderSongList();
});

window.addEventListener('DOMContentLoaded', () => {
  loadSongs();
});