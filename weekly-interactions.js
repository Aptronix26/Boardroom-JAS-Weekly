(function(){
  'use strict';
  const clean=value=>String(value||'').replace(/\s+/g,' ').trim();

  function enhanceCards(){
    document.querySelectorAll('.kpi,.metric').forEach(card=>{
      const label=clean(card.querySelector('.label,span')?.textContent);
      const context=clean(card.querySelector('.sub,small')?.textContent);
      if(!label||!context)return;
      const existing=card.querySelector(':scope > .ix-tip');
      if(existing){
        if(existing.textContent!==context)existing.textContent=context;
        card.setAttribute('aria-label',label+'. '+context);
        return;
      }
      card.classList.add('ix-focusable');
      card.tabIndex=0;
      card.setAttribute('role','group');
      card.setAttribute('aria-label',label+'. '+context);
      const tip=document.createElement('span');
      tip.className='ix-tip';
      tip.setAttribute('aria-hidden','true');
      tip.textContent=context;
      card.appendChild(tip);
    });
  }

  function trackPointer(){
    if(!matchMedia('(hover:hover) and (pointer:fine)').matches)return;
    document.addEventListener('pointermove',event=>{
      const surface=event.target.closest('.kpi,.metric,.card,.regional-summary-placeholder');
      if(!surface)return;
      const rect=surface.getBoundingClientRect();
      surface.style.setProperty('--ix-x',((event.clientX-rect.left)/rect.width*100).toFixed(1)+'%');
      surface.style.setProperty('--ix-y',((event.clientY-rect.top)/rect.height*100).toFixed(1)+'%');
    },{passive:true});
  }

  function enhanceLegend(){
    document.addEventListener('pointerover',event=>{
      const item=event.target.closest('.legend .li');
      if(!item)return;
      const grid=item.closest('.donut-grid');
      grid?.classList.add('ix-legend-focus');
      item.classList.add('ix-legend-active');
    });
    document.addEventListener('pointerout',event=>{
      const grid=event.target.closest('.donut-grid');
      if(!grid||grid.contains(event.relatedTarget))return;
      grid.classList.remove('ix-legend-focus');
      grid.querySelectorAll('.ix-legend-active').forEach(item=>item.classList.remove('ix-legend-active'));
    });
  }

  function enhanceTables(){
    document.addEventListener('pointerover',event=>{
      const cell=event.target.closest('td');
      if(!cell)return;
      const table=cell.closest('table');
      if(!table)return;
      const row=cell.parentElement;
      row.classList.add('ix-row-hover');
      const index=Array.prototype.indexOf.call(row.children,cell);
      table.querySelectorAll('tbody tr').forEach(item=>item.children[index]?.classList.add('ix-column-hover'));
    });
    document.addEventListener('pointerout',event=>{
      const table=event.target.closest('table');
      if(!table||table.contains(event.relatedTarget))return;
      table.querySelectorAll('.ix-row-hover,.ix-column-hover').forEach(item=>item.classList.remove('ix-row-hover','ix-column-hover'));
    });
  }

  function enhanceCharts(){
    document.querySelectorAll('.trend').forEach(svg=>{
      const points=svg.querySelectorAll('circle');
      const labels=svg.querySelectorAll('text');
      points.forEach((point,index)=>{
        if(point.querySelector('title'))return;
        const value=clean(labels[index]?.textContent);
        const period=clean(labels[labels.length-2+index]?.textContent);
        const title=document.createElementNS('http://www.w3.org/2000/svg','title');
        title.textContent=(period||'Weekly')+' revenue: ₹'+value+' Cr';
        point.appendChild(title);
      });
    });
  }

  function openDashboardPage(pageId,metric){
    const nav=document.querySelector('.menu button[data-id="'+pageId+'"]');
    if(nav)nav.click();
    if(pageId==='store'&&metric){
      const select=document.getElementById('storeMetric');
      if(select){
        select.value=metric;
        select.dispatchEvent(new Event('change',{bubbles:true}));
      }
    }
    requestAnimationFrame(()=>document.getElementById(pageId)?.querySelector('h1')?.focus({preventScroll:true}));
  }

  function makeKpisActionable(){
    const destinations={
      'Revenue (Total)':{page:'executive'},
      'Conversion %':{page:'store',metric:'conversion'},
      'Loan Attach %':{page:'store',metric:'loan'},
      'Trade-in Attach %':{page:'store',metric:'trade'},
      'Reporting Stores':{page:'store',metric:'summary'},
      'Retail Excellence Leader':{page:'retail'}
    };
    document.querySelectorAll('#overview .kpi').forEach(card=>{
      const label=clean(card.querySelector('.label')?.textContent);
      const target=destinations[label];
      if(!target||card.classList.contains('ix-kpi-link'))return;
      card.classList.add('ix-kpi-link');
      card.setAttribute('role','button');
      card.setAttribute('aria-label',(card.getAttribute('aria-label')||label)+'. Open details.');
      const hint=document.createElement('span');
      hint.className='ix-open-hint';
      hint.textContent='View details →';
      card.appendChild(hint);
      const activate=()=>openDashboardPage(target.page,target.metric);
      card.addEventListener('click',activate);
      card.addEventListener('keydown',event=>{
        if(event.key==='Enter'||event.key===' '){event.preventDefault();activate();}
      });
    });
  }

  function addSearchableSelect(select,label){
    if(!select||select.dataset.ixSearchReady)return;
    select.dataset.ixSearchReady='true';
    const wrap=document.createElement('div');
    wrap.className='ix-search-select';
    select.parentNode.insertBefore(wrap,select);
    wrap.appendChild(select);
    const input=document.createElement('input');
    const list=document.createElement('datalist');
    const listId='ix-list-'+select.id;
    input.type='search';
    input.className='ix-search-input';
    input.setAttribute('list',listId);
    input.setAttribute('aria-label','Search '+label);
    input.placeholder='Search '+label;
    list.id=listId;
    wrap.insertBefore(input,select);
    wrap.appendChild(list);

    const syncOptions=()=>{
      const current=select.options[select.selectedIndex];
      input.value=current?.textContent||'';
      list.replaceChildren(...Array.from(select.options).map(option=>{
        const item=document.createElement('option');
        item.value=option.textContent;
        return item;
      }));
    };
    const choose=()=>{
      const wanted=input.value.trim().toLowerCase();
      const option=Array.from(select.options).find(item=>item.textContent.trim().toLowerCase()===wanted);
      if(!option){input.setCustomValidity('Choose a value from the list');return;}
      input.setCustomValidity('');
      select.value=option.value;
      select.dispatchEvent(new Event('change',{bubbles:true}));
      input.blur();
    };
    input.addEventListener('change',choose);
    input.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();choose();}});
    select.addEventListener('change',syncOptions);
    new MutationObserver(syncOptions).observe(select,{childList:true});
    syncOptions();
  }

  function filterSummary(container){
    return Array.from(container.querySelectorAll('select')).map(select=>{
      const label={storeArmFilter:'ARM',storeSelect:'Store',storeMetric:'View',armNameFilter:'ARM',armMetric:'View'}[select.id]||'Filter';
      return label+': '+clean(select.options[select.selectedIndex]?.textContent);
    }).join(' · ');
  }

  function enhanceFilters(){
    document.querySelectorAll('.filters').forEach(container=>{
      if(container.dataset.ixReady)return;
      container.dataset.ixReady='true';
      container.classList.add('ix-filter-bar');
      const status=document.createElement('div');
      status.className='ix-filter-status';
      status.setAttribute('role','status');
      status.setAttribute('aria-live','polite');
      const reset=document.createElement('button');
      reset.type='button';
      reset.className='ix-reset-filters';
      reset.textContent='Reset filters';
      container.append(status,reset);
      const update=()=>{status.textContent=filterSummary(container);};
      container.addEventListener('change',()=>requestAnimationFrame(update));
      reset.addEventListener('click',()=>{
        const page=container.closest('.page')?.id;
        if(page==='store'){
          const arm=document.getElementById('storeArmFilter');
          arm.value='All';arm.dispatchEvent(new Event('change',{bubbles:true}));
          const metric=document.getElementById('storeMetric');
          metric.value='summary';metric.dispatchEvent(new Event('change',{bubbles:true}));
        }else if(page==='arm'){
          const name=document.getElementById('armNameFilter');
          if(name.options.length)name.selectedIndex=0;
          name.dispatchEvent(new Event('change',{bubbles:true}));
          const metric=document.getElementById('armMetric');
          metric.value='summary';metric.dispatchEvent(new Event('change',{bubbles:true}));
        }
        requestAnimationFrame(update);
      });
      update();
    });
    addSearchableSelect(document.getElementById('storeSelect'),'store');
    addSearchableSelect(document.getElementById('armNameFilter'),'ARM');
  }

  function addDisclosure(section,defaultOpen){
    const heading=section?.querySelector(':scope > h3');
    if(!heading||section.dataset.ixDisclosure)return;
    section.dataset.ixDisclosure='true';
    section.classList.add('ix-disclosure');
    const content=Array.from(section.children).filter(child=>child!==heading);
    const button=document.createElement('button');
    button.type='button';
    button.className='ix-disclosure-toggle';
    const setOpen=open=>{
      section.classList.toggle('is-collapsed',!open);
      content.forEach(child=>child.hidden=!open);
      button.setAttribute('aria-expanded',String(open));
      button.textContent=open?'Collapse':'Expand';
    };
    button.addEventListener('click',()=>setOpen(button.getAttribute('aria-expanded')!=='true'));
    heading.appendChild(button);
    setOpen(defaultOpen);
  }

  function enhanceLongSections(){
    document.querySelectorAll('#boardroom .method').forEach(section=>{
      const title=clean(section.querySelector(':scope > h3')?.childNodes[0]?.textContent);
      if(title==='Boardroom Read')addDisclosure(section,true);
      if(title==='Source QA')addDisclosure(section,false);
    });
  }

  function addScrollTools(){
    const progress=document.createElement('div');
    progress.className='ix-scroll-progress';
    progress.setAttribute('aria-hidden','true');
    document.body.appendChild(progress);
    const back=document.createElement('button');
    back.className='ix-back-top';
    back.type='button';
    back.title='Back to top';
    back.setAttribute('aria-label','Back to top');
    back.textContent='↑';
    back.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));
    document.body.appendChild(back);
    const update=()=>{
      const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
      progress.style.transform='scaleX('+Math.min(1,scrollY/max)+')';
      back.classList.toggle('is-visible',scrollY>520);
    };
    addEventListener('scroll',update,{passive:true});
    update();
  }

  function init(){
    enhanceCards();
    makeKpisActionable();
    trackPointer();
    enhanceLegend();
    enhanceTables();
    enhanceCharts();
    enhanceFilters();
    enhanceLongSections();
    addScrollTools();
    new MutationObserver(()=>{enhanceCards();enhanceCharts()}).observe(document.body,{childList:true,characterData:true,subtree:true});
    document.documentElement.classList.add('weekly-interactions-ready');
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
