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
  const tagSelect = document.getElementById('tag-filter');
  const allTags = new Set();

  allSongs.forEach(song => {
    if (Array.isArray(song.tags)) {
      song.tags.forEach(tag => allTags.add(tag));
    }
  });

  const previousValue = tagSelect.value || "全部";

  tagSelect.innerHTML = '';
  const allOption = document.createElement('option');
  allOption.value = '全部';
  allOption.textContent = '全部';
  tagSelect.appendChild(allOption);

  [...allTags].sort().forEach(tag => {
    const option = document.createElement('option');
    option.value = tag;
    option.textContent = tag;
    tagSelect.appendChild(option);
  });

  // 恢复上一次选择的值
  tagSelect.value = previousValue;
  activeTag = tagSelect.value; // 强制同步

  renderSongList(); // 触发更新
}

function getVisualLength(str) {
  let len = 0;
  for (const ch of str) {
    len += ch.charCodeAt(0) > 255 ? 2 : 1;
  }
  return len;
}

function renderSongList() {
  const ul = document.getElementById('song-list');
  ul.innerHTML = '';

  const keyword = activeKeyword.toLowerCase();

  const filtered = allSongs.filter(song => {
    const titleMatch = song.title.toLowerCase().includes(keyword);
    const tags = song.tags || [];

    if (activeTag === "没唱过") {
      // 只显示包含“没唱过”的歌曲
      return tags.includes("没唱过") && titleMatch;
    } else {
      // 显示匹配标签但排除“没唱过”的歌曲
      const tagMatch = (activeTag === "全部" || tags.includes(activeTag)) && !tags.includes("没唱过");
      return titleMatch && tagMatch;
    }
  });

  // 按视觉长度排序（短 → 长）
  filtered.sort((a, b) => getVisualLength(a.title) - getVisualLength(b.title));

  for (const song of filtered) {
    const li = document.createElement('li');
    const searchUrl = buildBilibiliSearchURL(song.title);
    li.innerHTML = `<a href="${searchUrl}" target="_blank">${song.title}</a>`;
    ul.appendChild(li);
  }
}

//构筑搜索链接
function buildBilibiliSearchURL(songTitle) {
  const base = "https://search.bilibili.com/all?keyword=";
  return base + "伊索尔Sol+" + encodeURIComponent(songTitle);
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