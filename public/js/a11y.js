(function(){
'use strict';

/* ===== ACCESSIBILITY WIDGET (EN 301 549 / EAA compliant) ===== */
function initA11yWidget(){
    var state={
        fontSize:parseInt(localStorage.getItem('a11y_fs')||'0'),
        lineHeight:parseInt(localStorage.getItem('a11y_lh')||'0'),
        wordSpacing:parseInt(localStorage.getItem('a11y_ws')||'0'),
        contrast:localStorage.getItem('a11y_contrast')==='1',
        grayscale:localStorage.getItem('a11y_gray')==='1',
        links:localStorage.getItem('a11y_links')==='1',
        readable:localStorage.getItem('a11y_readable')==='1',
        cursor:localStorage.getItem('a11y_cursor')==='1',
        pauseAnim:localStorage.getItem('a11y_pause')==='1'
    };

    var css=document.createElement('style');
    css.textContent=
        /* A11y root - sits on <html> not <body>, immune to body filters */
        '#a11y-root{position:fixed;bottom:0;left:0;z-index:99999;pointer-events:none}'+
        '#a11y-root>*{pointer-events:auto}'+

        /* A11y toggle button — bold orange */
        '#a11y-toggle{position:fixed;bottom:20px;left:20px;z-index:99999;width:52px;height:52px;border-radius:50%;background:#FF6B35;border:2px solid #FF8A5C;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(255,107,53,.4);transition:all .2s}'+
        '#a11y-toggle:hover{background:#FF8A5C;box-shadow:0 4px 24px rgba(255,107,53,.6);transform:scale(1.08)}'+
        '#a11y-toggle:focus-visible{outline:3px solid #fff;outline-offset:3px}'+
        '#a11y-toggle svg{width:26px;height:26px;fill:none;stroke:#fff;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}'+

        /* A11y panel */
        '#a11y-panel{position:fixed;bottom:84px;left:20px;z-index:99999;width:300px;max-height:80vh;overflow-y:auto;background:#2C2C2E;border:1px solid #48484A;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,.5);padding:20px;display:none;animation:a11yIn .25s ease}'+
        '#a11y-panel.open{display:block}'+
        '@keyframes a11yIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}'+
        '.a11y-title{font-size:15px;font-weight:700;color:#fff;margin-bottom:4px;display:flex;align-items:center;gap:8px}'+
        '.a11y-title svg{width:18px;height:18px;stroke:#FF6B35;fill:none;stroke-width:2}'+
        '.a11y-subtitle{font-size:11px;color:#6E6E74;margin-bottom:16px}'+
        '.a11y-section{font-size:11px;font-weight:700;color:#6E6E74;text-transform:uppercase;letter-spacing:1px;margin:16px 0 8px;padding-top:12px;border-top:1px solid rgba(72,72,74,.3)}'+
        '.a11y-section:first-of-type{margin-top:0;padding-top:0;border-top:none}'+
        '.a11y-row{display:flex;align-items:center;justify-content:space-between;padding:8px 0}'+
        '.a11y-label{font-size:13px;color:#D4D4D8}'+
        '.a11y-controls{display:flex;gap:5px;align-items:center}'+
        '.a11y-btn{background:#3A3A3C;color:#D4D4D8;border:1px solid transparent;width:32px;height:32px;border-radius:6px;cursor:pointer;font-size:14px;font-weight:700;display:flex;align-items:center;justify-content:center;transition:all .15s;font-family:inherit}'+
        '.a11y-btn:hover{background:#48484A;color:#fff}'+
        '.a11y-btn:focus-visible{outline:2px solid #FF6B35;outline-offset:1px}'+
        '.a11y-btn.active{background:rgba(255,107,53,.15);color:#FF6B35;border-color:rgba(255,107,53,.3)}'+
        '.a11y-val{font-size:12px;color:#A3A3A9;min-width:24px;text-align:center}'+
        '.a11y-reset{width:100%;margin-top:16px;padding:10px;background:none;border:1px solid #48484A;border-radius:8px;color:#A3A3A9;font-size:13px;cursor:pointer;font-family:inherit;transition:all .2s}'+
        '.a11y-reset:hover{border-color:#FF6B35;color:#FF6B35}'+
        '.a11y-reset:focus-visible{outline:2px solid #FF6B35;outline-offset:1px}'+

        /* High contrast — invert to light bg, dark text, strong borders */
        '.a11y-contrast{background:#fff!important;color:#000!important}'+
        '.a11y-contrast *:not(#a11y-root):not(#a11y-root *):not(#a11y-toggle):not(#a11y-panel):not(#a11y-panel *){color:#000!important;background-color:#fff!important;border-color:#000!important}'+
        '.a11y-contrast a:not(#a11y-panel a){color:#0000EE!important;text-decoration:underline!important}'+
        '.a11y-contrast img,.a11y-contrast svg:not(#a11y-root svg){filter:none}'+
        '.a11y-contrast .nav,.a11y-contrast .footer,.a11y-contrast .sticky-cta{background:rgba(255,255,255,0.95)!important;border-color:#000!important}'+
        '.a11y-contrast .play-badge{background:#000!important;color:#fff!important;border-color:#000!important}'+
        '.a11y-contrast .play-badge *{color:#fff!important;background-color:#000!important}'+
        '.a11y-contrast .m-btn.orange{background:#000!important;color:#fff!important}'+
        '.a11y-contrast h1,.a11y-contrast h2,.a11y-contrast h3{color:#000!important}'+

        /* Grayscale */
        '.a11y-grayscale{-webkit-filter:grayscale(1);filter:grayscale(1)}'+
        '#a11y-root{-webkit-filter:none!important;filter:none!important}'+

        /* Highlight links */
        '.a11y-links a:not(#a11y-panel a):not(#a11y-toggle){outline:2px solid #FF6B35!important;outline-offset:2px!important;text-decoration:underline!important}'+

        /* Readable font */
        '.a11y-readable,.a11y-readable *:not(#a11y-panel *){font-family:Arial,Helvetica,sans-serif!important;letter-spacing:0.05em!important}'+

        /* Large cursor */
        '.a11y-cursor,.a11y-cursor *{cursor:url("data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\'><circle cx=\'16\' cy=\'16\' r=\'14\' fill=\'none\' stroke=\'%23FF6B35\' stroke-width=\'3\'/><circle cx=\'16\' cy=\'16\' r=\'3\' fill=\'%23FF6B35\'/></svg>") 16 16,auto!important}'+

        /* Pause animations */
        '.a11y-pause,.a11y-pause *{animation-duration:0s!important;animation:none!important;transition-duration:0s!important;scroll-behavior:auto!important}'+
        '.a11y-pause .reveal.will-animate{opacity:1!important;transform:none!important}'+

        /* Mobile offset for sticky CTA */
        '@media(max-width:768px){#a11y-toggle{bottom:70px}#a11y-panel{bottom:134px;left:12px;right:12px;width:auto}}';
    document.head.appendChild(css);

    // Create root container on <html> (outside <body> filter chain)
    var root=document.createElement('div');
    root.id='a11y-root';
    document.documentElement.appendChild(root);

    // Toggle button
    var btn=document.createElement('button');
    btn.id='a11y-toggle';
    btn.setAttribute('aria-label','Open accessibility tools');
    btn.setAttribute('aria-expanded','false');
    btn.setAttribute('title','Accessibility tools');
    btn.innerHTML='<svg viewBox="0 0 24 24"><circle cx="12" cy="4" r="2"/><path d="M12 8v4m0 0l-3 6m3-6l3 6"/><path d="M7 10h10"/></svg>';
    root.appendChild(btn);

    // Panel
    var panel=document.createElement('div');
    panel.id='a11y-panel';
    panel.setAttribute('role','dialog');
    panel.setAttribute('aria-label','Accessibility settings');
    panel.innerHTML=
        '<div class="a11y-title">'+
            '<svg viewBox="0 0 24 24"><circle cx="12" cy="4" r="2"/><path d="M12 8v4m0 0l-3 6m3-6l3 6"/><path d="M7 10h10"/></svg>'+
            'Accessibility</div>'+
        '<div class="a11y-subtitle">EN 301 549 / EAA compliant</div>'+

        '<div class="a11y-section">Text</div>'+
        '<div class="a11y-row">'+
            '<span class="a11y-label">Font size</span>'+
            '<div class="a11y-controls">'+
                '<button class="a11y-btn" id="a11y-fs-down" aria-label="Decrease font size">A&#8722;</button>'+
                '<span class="a11y-val" id="a11y-fs-val">0</span>'+
                '<button class="a11y-btn" id="a11y-fs-up" aria-label="Increase font size">A+</button>'+
            '</div>'+
        '</div>'+
        '<div class="a11y-row">'+
            '<span class="a11y-label">Line height</span>'+
            '<div class="a11y-controls">'+
                '<button class="a11y-btn" id="a11y-lh-down" aria-label="Decrease line height">&#8722;</button>'+
                '<span class="a11y-val" id="a11y-lh-val">0</span>'+
                '<button class="a11y-btn" id="a11y-lh-up" aria-label="Increase line height">+</button>'+
            '</div>'+
        '</div>'+
        '<div class="a11y-row">'+
            '<span class="a11y-label">Word spacing</span>'+
            '<div class="a11y-controls">'+
                '<button class="a11y-btn" id="a11y-ws-down" aria-label="Decrease word spacing">&#8722;</button>'+
                '<span class="a11y-val" id="a11y-ws-val">0</span>'+
                '<button class="a11y-btn" id="a11y-ws-up" aria-label="Increase word spacing">+</button>'+
            '</div>'+
        '</div>'+
        '<div class="a11y-row">'+
            '<span class="a11y-label">Readable font</span>'+
            '<div class="a11y-controls">'+
                '<button class="a11y-btn" id="a11y-readable" aria-label="Toggle readable font">Aa</button>'+
            '</div>'+
        '</div>'+

        '<div class="a11y-section">Display</div>'+
        '<div class="a11y-row">'+
            '<span class="a11y-label">High contrast</span>'+
            '<div class="a11y-controls">'+
                '<button class="a11y-btn" id="a11y-contrast" aria-label="Toggle high contrast">C</button>'+
            '</div>'+
        '</div>'+
        '<div class="a11y-row">'+
            '<span class="a11y-label">Grayscale</span>'+
            '<div class="a11y-controls">'+
                '<button class="a11y-btn" id="a11y-gray" aria-label="Toggle grayscale">G</button>'+
            '</div>'+
        '</div>'+
        '<div class="a11y-row">'+
            '<span class="a11y-label">Highlight links</span>'+
            '<div class="a11y-controls">'+
                '<button class="a11y-btn" id="a11y-links" aria-label="Toggle link highlighting">L</button>'+
            '</div>'+
        '</div>'+

        '<div class="a11y-section">Navigation</div>'+
        '<div class="a11y-row">'+
            '<span class="a11y-label">Large cursor</span>'+
            '<div class="a11y-controls">'+
                '<button class="a11y-btn" id="a11y-cursor" aria-label="Toggle large cursor">&#9096;</button>'+
            '</div>'+
        '</div>'+
        '<div class="a11y-row">'+
            '<span class="a11y-label">Pause animations</span>'+
            '<div class="a11y-controls">'+
                '<button class="a11y-btn" id="a11y-pause" aria-label="Pause all animations">&#9646;&#9646;</button>'+
            '</div>'+
        '</div>'+

        '<button class="a11y-reset" id="a11y-reset">Reset all settings</button>';
    root.appendChild(panel);

    function apply(){
        // Font size via zoom (works with px values)
        var zoom=1+state.fontSize*0.15;
        document.body.style.zoom=zoom;

        // Line height
        document.body.style.lineHeight=state.lineHeight!==0?(1.7+state.lineHeight*0.3)+'':'';

        // Word spacing
        document.body.style.wordSpacing=state.wordSpacing!==0?(state.wordSpacing*3)+'px':'';

        // Toggle classes on <body>
        document.body.classList.toggle('a11y-contrast',state.contrast);
        document.body.classList.toggle('a11y-grayscale',state.grayscale);
        document.body.classList.toggle('a11y-links',state.links);
        document.body.classList.toggle('a11y-readable',state.readable);
        document.body.classList.toggle('a11y-cursor',state.cursor);
        document.body.classList.toggle('a11y-pause',state.pauseAnim);

        // Update values
        document.getElementById('a11y-fs-val').textContent=(state.fontSize>0?'+':'')+state.fontSize;
        document.getElementById('a11y-lh-val').textContent=(state.lineHeight>0?'+':'')+state.lineHeight;
        document.getElementById('a11y-ws-val').textContent=(state.wordSpacing>0?'+':'')+state.wordSpacing;

        // Active states
        document.getElementById('a11y-contrast').classList.toggle('active',state.contrast);
        document.getElementById('a11y-gray').classList.toggle('active',state.grayscale);
        document.getElementById('a11y-links').classList.toggle('active',state.links);
        document.getElementById('a11y-readable').classList.toggle('active',state.readable);
        document.getElementById('a11y-cursor').classList.toggle('active',state.cursor);
        document.getElementById('a11y-pause').classList.toggle('active',state.pauseAnim);

        // Persist
        localStorage.setItem('a11y_fs',state.fontSize);
        localStorage.setItem('a11y_lh',state.lineHeight);
        localStorage.setItem('a11y_ws',state.wordSpacing);
        localStorage.setItem('a11y_contrast',state.contrast?'1':'0');
        localStorage.setItem('a11y_gray',state.grayscale?'1':'0');
        localStorage.setItem('a11y_links',state.links?'1':'0');
        localStorage.setItem('a11y_readable',state.readable?'1':'0');
        localStorage.setItem('a11y_cursor',state.cursor?'1':'0');
        localStorage.setItem('a11y_pause',state.pauseAnim?'1':'0');
    }

    apply();

    // Toggle panel
    btn.addEventListener('click',function(){
        var open=panel.classList.toggle('open');
        btn.setAttribute('aria-expanded',String(open));
        if(open) panel.querySelector('.a11y-btn').focus();
    });

    // Close on outside click
    document.addEventListener('click',function(e){
        if(!panel.contains(e.target)&&e.target!==btn&&!btn.contains(e.target)){
            panel.classList.remove('open');
            btn.setAttribute('aria-expanded','false');
        }
    });

    // Close on Escape
    document.addEventListener('keydown',function(e){
        if(e.key==='Escape'&&panel.classList.contains('open')){
            panel.classList.remove('open');
            btn.setAttribute('aria-expanded','false');
            btn.focus();
        }
    });

    // Focus trap
    panel.addEventListener('keydown',function(e){
        if(e.key!=='Tab')return;
        var focusable=panel.querySelectorAll('button');
        var first=focusable[0],last=focusable[focusable.length-1];
        if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
        else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
    });

    // Font size
    document.getElementById('a11y-fs-up').addEventListener('click',function(){if(state.fontSize<4){state.fontSize++;apply();}});
    document.getElementById('a11y-fs-down').addEventListener('click',function(){if(state.fontSize>-2){state.fontSize--;apply();}});

    // Line height
    document.getElementById('a11y-lh-up').addEventListener('click',function(){if(state.lineHeight<4){state.lineHeight++;apply();}});
    document.getElementById('a11y-lh-down').addEventListener('click',function(){if(state.lineHeight>-2){state.lineHeight--;apply();}});

    // Word spacing
    document.getElementById('a11y-ws-up').addEventListener('click',function(){if(state.wordSpacing<4){state.wordSpacing++;apply();}});
    document.getElementById('a11y-ws-down').addEventListener('click',function(){if(state.wordSpacing>-2){state.wordSpacing--;apply();}});

    // Toggles
    document.getElementById('a11y-contrast').addEventListener('click',function(){state.contrast=!state.contrast;apply();});
    document.getElementById('a11y-gray').addEventListener('click',function(){state.grayscale=!state.grayscale;apply();});
    document.getElementById('a11y-links').addEventListener('click',function(){state.links=!state.links;apply();});
    document.getElementById('a11y-readable').addEventListener('click',function(){state.readable=!state.readable;apply();});
    document.getElementById('a11y-cursor').addEventListener('click',function(){state.cursor=!state.cursor;apply();});
    document.getElementById('a11y-pause').addEventListener('click',function(){state.pauseAnim=!state.pauseAnim;apply();});

    // Reset
    document.getElementById('a11y-reset').addEventListener('click',function(){
        state={fontSize:0,lineHeight:0,wordSpacing:0,contrast:false,grayscale:false,links:false,readable:false,cursor:false,pauseAnim:false};
        apply();
    });
}

/* ===== INIT ===== */
if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',function(){initA11yWidget();});
}else{
    initA11yWidget();
}

})();
