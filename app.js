/* Farmacinha da Mamã — quiz + página de venda
   As respostas do quiz ficam só no navegador: NÃO são enviadas para o Pixel
   (regras da Meta sobre dados de saúde). O Pixel recebe apenas eventos padrão. */
(function () {
  var S = window.SITE || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var fbq = window.fbq || function () {};

  /* ------------------------------------------------------------ passos */
  var STEPS = [
    { type: 'intro' },
    { id: 'idade', type: 'grid', q: 'Qual é a idade do seu filho mais novo?', opts: [
      ['Até 2 anos', 'img/idade-0-2.webp'], ['3 a 7 anos', 'img/idade-3-7.webp'],
      ['8 a 12 anos', 'img/idade-8-12.webp'], ['Acima de 12 anos', 'img/idade-12mais.webp']] },
    { id: 'filhos', type: 'grid', q: 'Quantos filhos tem?', opts: [
      ['01', 'img/filhos-1.webp'], ['02', 'img/filhos-2.webp'], ['03', 'img/filhos-3.webp'], ['04 ou mais', 'img/filhos-4.webp']] },
    { id: 'freq', type: 'emoji', q: 'Com que frequência o seu filho fica doentinho?', opts: [
      ['😭', 'Pelo menos uma vez por mês'], ['😩', 'Quase todos os meses'],
      ['😔', 'De vez em quando, mas preocupa-me'], ['😁', 'Quase nunca, mas quero estar preparada']] },
    { id: 'recup', type: 'list', q: 'Quando fica doente, como costuma ser em casa?', opts: [
      'Demora vários dias até voltar ao normal', 'Demora um pouco e eu fico sem saber o que fazer', 'Passa depressa, mas quero agir melhor'] },
    { id: 'queixa', type: 'list', q: 'O que mais acontece aí em casa?', opts: [
      'Tosse, nariz entupido e garganta', 'Febre', 'Barriguinha: diarreia, vómitos ou cólicas', 'Pele: picadas, feridinhas ou comichão', 'Um pouco de tudo 😅'] },
    { id: 'peso', type: 'list', q: 'Quando isso acontece, o que mais lhe pesa?', opts: [
      'Não saber o que posso fazer em casa', 'Ele perde dias de escola', 'A rotina da família vira um caos',
      'Não sei em que conselhos confiar', 'Fico cansada e ansiosa, sem dormir'] },
    { id: 'aprender', type: 'list', q: 'Gostaria de aprender cuidados caseiros seguros, com a idade certa para o seu filho?', opts: [
      'Sim!', 'Quero saber mais', 'Tenho dúvidas, mas tenho interesse'] },
    { id: 'objetivo', type: 'list', q: 'Qual é o seu maior objectivo?', opts: [
      'Saber o que fazer nos primeiros sintomas', 'Usar mais ingredientes naturais, com segurança',
      'Reconhecer cedo quando é hora de ir ao médico', 'Ter mais calma e confiança como mãe', 'Tudo isto!'] },
    { type: 'loading' },
    { type: 'result' }
  ];

  var answers = {}, cur = 0, hist = [];
  var stage = $('#qstage'), bar = $('#qbar'), back = $('#qback');

  function progress() {
    var n = STEPS.length - 1;
    bar.style.width = Math.max(6, Math.round(cur / n * 100)) + '%';
    back.hidden = cur === 0 || STEPS[cur].type === 'loading' || STEPS[cur].type === 'result';
  }
  function go(i, isBack) {
    if (!isBack) hist.push(cur);
    cur = i;
    stage.classList.remove('in'); void stage.offsetWidth;
    render(); progress(); stage.classList.add('in');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  back.addEventListener('click', function () { if (hist.length) go(hist.pop(), true); });

  function pick(step, val, el) {
    answers[step.id] = val;
    el.classList.add('sel');
    setTimeout(function () { go(cur + 1); }, 320);
  }
  function check() {
    return '<span class="ck"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';
  }

  function render() {
    var st = STEPS[cur], h = '';
    if (st.type === 'intro') {
      h = '<div class="q-intro">' +
        '<h1 class="qh">Quer cuidar da saúde do seu filho <span class="g">de forma mais natural e segura</span>?</h1>' +
        '<p class="qsub">Responda a 8 perguntas rápidas e descubra os cuidados caseiros certos para a idade do seu filho.</p>' +
        '<p class="qtime">(Leva só 1 minuto)</p>' +
        '<img class="qimg" src="img/intro.webp" alt="Menina sentada sorridente" width="640" height="454">' +
        '<button class="btn btn-q" id="start">Começar</button>' +
        '<p class="qlegal">Ao continuar, concorda com os <a href="termos">Termos de Uso</a> e a <a href="privacidade">Política de Privacidade</a>. As suas respostas ficam só no seu telemóvel.</p></div>';
      stage.innerHTML = h;
      $('#start').onclick = function () { go(1); };
      return;
    }
    if (st.type === 'grid') {
      h = '<h2 class="qh">' + st.q + '</h2><div class="qgrid">';
      st.opts.forEach(function (o, i) {
        h += '<button class="gopt' + (answers[st.id] === o[0] ? ' sel' : '') + '" data-i="' + i + '"><img src="' + o[1] + '" alt="" loading="eager"><span class="gl">' + check() + o[0] + '</span></button>';
      });
      stage.innerHTML = h + '</div>';
    }
    if (st.type === 'emoji' || st.type === 'list') {
      h = '<h2 class="qh">' + st.q + '</h2><div class="qlist">';
      st.opts.forEach(function (o, i) {
        var lab = st.type === 'emoji' ? o[1] : o;
        h += '<button class="lopt' + (answers[st.id] === lab ? ' sel' : '') + '" data-i="' + i + '">' +
          (st.type === 'emoji' ? '<span class="emo">' + o[0] + '</span>' : '') + check() + '<span>' + lab + '</span></button>';
      });
      stage.innerHTML = h + '</div>';
    }
    if (st.opts) {
      stage.querySelectorAll('[data-i]').forEach(function (b) {
        b.onclick = function () {
          var o = st.opts[+b.dataset.i];
          pick(st, st.type === 'grid' ? o[0] : st.type === 'emoji' ? o[1] : o, b);
        };
      });
    }
    if (st.type === 'loading') return loading();
    if (st.type === 'result') return result();
  }

  /* ------------------------------------------------------------ "a preparar" */
  function loading() {
    var provas = (S.provas || []);
    var social = provas.length
      ? '<div class="lprovas">' + provas.slice(0, 3).map(function (p) { return '<img src="img/provas/' + p + '" alt="Mensagem de cliente">'; }).join('') + '</div>'
      : '<div class="lchecks">' +
          ['A ver a idade do seu filho', 'A escolher os cuidados certos', 'A separar os sinais de alerta', 'A preparar o seu plano'].map(function (t) {
            return '<div class="lc"><span class="dot"></span>' + t + '</div>'; }).join('') + '</div>';
    stage.innerHTML =
      '<h2 class="qh">A preparar a sua Farmacinha…</h2>' +
      (S.clientes ? '<p class="qsub">Mais de ' + S.clientes.toLocaleString('pt-PT') + ' mães já têm a Farmacinha da Mamã.</p>' : '<p class="qsub">Estamos a juntar os cuidados mais indicados para a sua família.</p>') +
      '<div class="lhead"><b>A analisar as suas respostas…</b><b id="lpct">0%</b></div>' +
      '<div class="lbar"><span id="lfill"></span></div>' + social;
    var p = 0, fill = $('#lfill'), pct = $('#lpct'), items = stage.querySelectorAll('.lc');
    var t = setInterval(function () {
      p += 1 + Math.round(Math.random() * 2); if (p > 100) p = 100;
      fill.style.width = p + '%'; pct.textContent = p + '%';
      items.forEach(function (it, k) { if (p >= (k + 1) * 24) it.classList.add('ok'); });
      if (p >= 100) { clearInterval(t); setTimeout(function () { go(cur + 1); }, 650); }
    }, 70);
  }

  /* ------------------------------------------------------------ resultado com gráfico */
  function result() {
    var idade = answers.idade || '';
    var frase = /Até 2/.test(idade) ? 'Para bebés e crianças pequenas, o Manual Passo a Passo (Bónus 1) vai ser o seu melhor aliado.'
      : /Acima/.test(idade) ? 'Para filhos maiores, vai encontrar cuidados simples que ele próprio pode aprender a fazer consigo.'
      : 'Para a idade do seu filho, a Farmacinha tem cuidados para quase todos os dias difíceis.';
    stage.innerHTML =
      '<h1 class="qh big">A sua Farmacinha da Mamã</h1>' +
      '<p class="qsub">Com base nas suas respostas, <b class="t">a sua casa pode ficar muito mais preparada</b> para os dias em que o seu filho adoece. ' + frase + '</p>' +
      '<div class="chart">' +
      '<svg viewBox="0 0 340 220" role="img" aria-label="A sua confiança: hoje, em 7 dias e em 30 dias">' +
      '<defs><linearGradient id="gl" x1="0" x2="1"><stop offset="0" stop-color="#D9653B"/><stop offset=".5" stop-color="#E9A93A"/><stop offset="1" stop-color="#2F9E6A"/></linearGradient></defs>' +
      [40, 80, 120, 160].map(function (y) { return '<line x1="34" x2="320" y1="' + y + '" y2="' + y + '" class="gridl"/>'; }).join('') +
      '<path id="cpath" d="M40 168 C 110 160, 150 140, 180 122 S 270 60, 306 42" fill="none" stroke="url(#gl)" stroke-width="5" stroke-linecap="round"/>' +
      '<g class="pt p1"><circle cx="40" cy="168" r="13" class="halo"/><circle cx="40" cy="168" r="7" fill="#D9653B"/></g>' +
      '<g class="pt p2"><circle cx="180" cy="122" r="13" class="halo"/><circle cx="180" cy="122" r="7" fill="#E9A93A"/></g>' +
      '<g class="pt p3"><circle cx="306" cy="42" r="13" class="halo"/><circle cx="306" cy="42" r="7" fill="#2F9E6A"/></g>' +
      '</svg>' +
      '<span class="lab l1">Hoje</span><span class="lab l2">Em 7 dias</span><span class="lab l3">Em 30 dias</span>' +
      '<div class="axis"><span>Insegura</span><span>Mais preparada</span><span>Confiante</span></div>' +
      '</div>' +
      '<p class="cnote">A sua confiança para cuidar em casa — e para saber quando ir ao médico.</p>' +
      '<button class="btn btn-q" id="ver">Ver a minha Farmacinha</button>';
    $('#ver').onclick = showOffer;
  }

  /* ------------------------------------------------------------ página de venda */
  var viewed = false;
  function showOffer() {
    $('#funil').hidden = true; $('#oferta').hidden = false;
    window.scrollTo(0, 0);
    if (location.hash !== '#oferta') history.replaceState(null, '', '#oferta');
    if (!viewed) { viewed = true; fbq('track', 'ViewContent', { content_name: 'Farmacinha da Mamã', content_type: 'product', value: S.preco, currency: 'AOA' }); }
    observe();
  }
  window.addEventListener('hashchange', function () { if (location.hash === '#oferta') showOffer(); });

  // checkout com UTMs preservados
  function checkoutUrl() {
    var u = S.checkout, q = location.search.replace(/^\?/, '');
    return q ? u + (u.indexOf('?') > -1 ? '&' : '?') + q : u;
  }
  document.querySelectorAll('[data-checkout]').forEach(function (a) {
    a.href = checkoutUrl();
    a.addEventListener('click', function () {
      fbq('track', 'InitiateCheckout', { content_name: 'Farmacinha da Mamã', value: S.preco, currency: 'AOA', num_items: 1 });
    });
  });
  document.querySelectorAll('[data-wa]').forEach(function (a) { a.addEventListener('click', function () { fbq('track', 'Contact'); }); });
  var pv = $('#preco-val'); if (pv && S.preco) pv.textContent = String(S.preco).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  // provas sociais reais
  if ((S.provas || []).length) {
    $('#provas').hidden = false;
    $('#provas-grid').innerHTML = S.provas.map(function (p) {
      return '<figure class="prova reveal"><img src="img/provas/' + p + '" alt="Mensagem de cliente" loading="lazy"></figure>';
    }).join('');
    if (S.clientes) $('#provas-sub').textContent = 'Mais de ' + S.clientes.toLocaleString('pt-PT') + ' mães já têm a Farmacinha da Mamã.';
  }

  // animação ao aparecer
  function observe() {
    var els = document.querySelectorAll('.reveal:not(.on)');
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('on'); }); return; }
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); } });
    }, { threshold: .12 });
    els.forEach(function (e) { io.observe(e); });
  }

  // pré-carregar imagens do quiz
  ['img/idade-0-2.webp', 'img/idade-3-7.webp', 'img/idade-8-12.webp', 'img/idade-12mais.webp',
   'img/filhos-1.webp', 'img/filhos-2.webp', 'img/filhos-3.webp', 'img/filhos-4.webp'].forEach(function (s) { var i = new Image(); i.src = s; });

  if (location.hash === '#oferta') showOffer();
  else { render(); progress(); stage.classList.add('in'); }
})();
