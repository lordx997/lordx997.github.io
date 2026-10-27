const Content = window.PortfolioContent;
const Tabs = [...document.querySelectorAll('[role="tab"]')];
const Panels = [...document.querySelectorAll('[role="tabpanel"]')];
const Search = document.querySelector('#system-search');
const Filters = document.querySelector('#tag-filters');
const SystemGrid = document.querySelector('#system-grid');
let SelectedTag = '';

function Element(Tag, Class, Text) {
  const Node = document.createElement(Tag);
  if (Class) Node.className = Class;
  if (Text !== undefined) Node.textContent = Text;
  return Node;
}
function ExternalLink(Text, Url, Class) {
  const Link = Element('a', Class, Text);
  Link.href = Url;
  Link.target = '_blank';
  Link.rel = 'noopener noreferrer';
  return Link;
}
function ShowTab(Name) {
  if (!Tabs.some(Tab => Tab.dataset.tab === Name)) return;
  Tabs.forEach(Tab => {
    const Active = Tab.dataset.tab === Name;
    Tab.setAttribute('aria-selected', String(Active));
    Tab.tabIndex = Active ? 0 : -1;
  });
  Panels.forEach(Panel => {
    Panel.hidden = Panel.id !== Name;
    if (Panel.hidden) Panel.querySelectorAll('video').forEach(Video => Video.pause());
  });
}
Tabs.forEach((Tab, Index) => {
  Tab.addEventListener('click', () => {
    ShowTab(Tab.dataset.tab);
    history.pushState(null, '', '#' + Tab.dataset.tab);
  });
  Tab.addEventListener('keydown', Event => {
    let Next;
    if (Event.key === 'ArrowRight') Next = (Index + 1) % Tabs.length;
    if (Event.key === 'ArrowLeft') Next = (Index + Tabs.length - 1) % Tabs.length;
    if (Event.key === 'Home') Next = 0;
    if (Event.key === 'End') Next = Tabs.length - 1;
    if (Next !== undefined) {
      Event.preventDefault();
      Tabs[Next].focus();
      Tabs[Next].click();
    }
  });
});
window.addEventListener('hashchange', () => ShowTab(location.hash.slice(1)));
ShowTab(location.hash.slice(1));

function SelectTag(Tag) {
  SelectedTag = Tag;
  Filters.querySelectorAll('button').forEach(Button => Button.setAttribute('aria-pressed', String(Button.dataset.tag === Tag)));
  RenderSystems();
}
['', ...new Set(Content.systems.flatMap(System => System.tags))].forEach(Tag => {
  const Button = Element('button', 'tag-button', Tag || 'All systems');
  Button.type = 'button';
  Button.dataset.tag = Tag;
  Button.setAttribute('aria-pressed', String(Tag === ''));
  Button.addEventListener('click', () => SelectTag(Tag));
  Filters.append(Button);
});
function RenderSystems() {
  SystemGrid.querySelectorAll('video').forEach(Video => Video.pause());
  SystemGrid.replaceChildren();
  const Words = Search.value.toLowerCase().replace(/#/g, '').split(/[\s,]+/).filter(Boolean);
  const Results = Content.systems.filter(System => {
    const Text = [System.name, System.description, ...System.tags].join(' ').toLowerCase();
    return (!SelectedTag || System.tags.includes(SelectedTag)) && Words.every(Word => Text.includes(Word));
  });
  Results.forEach(System => {
    const Card = Element('article', 'system-card');
    const Media = Element('div', 'system-media');
    const Video = Element('video');
    Video.controls = true;
    Video.playsInline = true;
    Video.preload = 'none';
    Video.poster = System.poster;
    Video.src = System.video;
    Video.setAttribute('aria-label', System.name + ' gameplay video');
    Video.append(ExternalLink('Download gameplay video', System.video));
    Media.append(Video);
    const Body = Element('div', 'system-body');
    Body.append(Element('p', 'eyebrow', 'GAMEPLAY SYSTEM / LUAU'), Element('h3', '', System.name), Element('p', 'card-description', System.description));
    const Tags = Element('div', 'card-tags');
    System.tags.forEach(Tag => {
      const Button = Element('button', '', Tag);
      Button.type = 'button';
      Button.setAttribute('aria-label', 'Filter by ' + Tag);
      Button.addEventListener('click', () => SelectTag(Tag));
      Tags.append(Button);
    });
    Body.append(Tags);
    const Actions = Element('div', 'card-actions');
    Actions.append(ExternalLink('View Luau code ↗', System.code, 'text-link'), ExternalLink('Try the demo ↗', System.game, 'text-link'));
    Body.append(Actions);
    Card.append(Media, Body, Element('p', 'video-note', System.videoNote));
    SystemGrid.append(Card);
  });
  document.querySelector('#result-count').textContent = `${Results.length} ${Results.length === 1 ? 'system' : 'systems'}${SelectedTag ? ' · ' + SelectedTag : ''}`;
  document.querySelector('#no-results').hidden = Results.length > 0;
  document.querySelector('#clear-filters').disabled = !Search.value && !SelectedTag;
}
Search.addEventListener('input', RenderSystems);
function ResetFilters() { Search.value = ''; SelectTag(''); Search.focus(); }
document.querySelector('#clear-filters').addEventListener('click', ResetFilters);
document.querySelector('#reset-search').addEventListener('click', ResetFilters);
RenderSystems();

Content.games.forEach(Game => {
  const Card = ExternalLink('', Game.url, 'game-card');
  Card.setAttribute('aria-label', Game.name + ' — open game on Roblox');
  const Media = Element('div', 'game-media');
  const Image = Element('img');
  Image.src = Game.thumbnail;
  Image.alt = Game.name + ' Roblox thumbnail';
  Image.width = 768; Image.height = 432; Image.loading = 'lazy';
  const Status = Element('span', 'game-status' + (Game.status === 'Coming soon' ? ' coming-soon' : ''), Game.status);
  Media.append(Image, Status);
  const Body = Element('div', 'game-body');
  Body.append(Element('p', 'eyebrow', Game.role), Element('h3', '', Game.name), Element('p', 'card-description', Game.description));
  const Foot = Element('div', 'game-footer');
  Foot.append(Element('span', '', Number.isFinite(Game.visits) ? new Intl.NumberFormat('en').format(Game.visits) + (Game.visits === 1 ? ' total visit' : ' total visits') : 'Visits unavailable'), Element('span', '', 'View game ↗'));
  Body.append(Foot); Card.append(Media, Body);
  document.querySelector('#game-grid').append(Card);
});

const Dialog = document.querySelector('#review-dialog');
Content.reviews.forEach(Review => {
  const Button = Element('button', 'review-card');
  Button.type = 'button';
  Button.setAttribute('aria-label', 'Enlarge review: ' + Review.caption);
  const Image = Element('img');
  Image.src = Review.image; Image.alt = Review.alt; Image.loading = 'lazy';
  Button.append(Image, Element('span', '', Review.caption + ' ↗'));
  Button.addEventListener('click', () => {
    const Full = document.querySelector('#review-image');
    Full.src = Review.image; Full.alt = Review.alt;
    document.querySelector('#review-caption').textContent = Review.caption;
    Dialog.showModal();
  });
  document.querySelector('#review-grid').append(Button);
});
document.querySelector('#no-reviews').hidden = Content.reviews.length > 0;
document.querySelector('#close-review').addEventListener('click', () => Dialog.close());
Dialog.addEventListener('click', Event => { if (Event.target === Dialog) Dialog.close(); });
document.querySelector('#year').textContent = new Date().getFullYear();
document.querySelector('#copy-discord').addEventListener('click', async () => {
  const Status = document.querySelector('#copy-status');
  try {
    await navigator.clipboard.writeText('lordx997');
    Status.textContent = 'Copied — find lordx997 on Discord.';
  } catch { Status.textContent = 'Select and copy the username above: lordx997'; }
});
