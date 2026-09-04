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
    trackPointer();
    enhanceLegend();
    enhanceTables();
    enhanceCharts();
    addScrollTools();
    new MutationObserver(()=>{enhanceCards();enhanceCharts()}).observe(document.body,{childList:true,characterData:true,subtree:true});
    document.documentElement.classList.add('weekly-interactions-ready');
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
