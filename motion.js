(function(){
"use strict";
function countUp(node,target){
  const suffix=node.dataset.suffix||"";
  const duration=1600;
  const start=performance.now();
  node.textContent="0"+suffix;
  function frame(now){
    const p=Math.min(1,(now-start)/duration);
    const eased=1-Math.pow(1-p,4);
    node.textContent=Math.round(target*eased).toLocaleString("en-US")+suffix;
    if(p<1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  setTimeout(()=>{node.textContent=target.toLocaleString("en-US")+suffix;},1900);
}
function run(){
  const stats=[...document.querySelectorAll(".stat-number")];
  stats.forEach(node=>{
    const target=node.id==="projectCount"
      ? document.querySelectorAll("#projectGrid .project-card").length
      : Math.max(0,Number(node.dataset.count)||0);
    node.dataset.count=String(target);
    countUp(node,target);
  });
  const revealTargets=document.querySelectorAll(
    ".service-card,.project-card,.section-heading,.about-section,.contact-panel,.skill-pills,.stats-section"
  );
  if("IntersectionObserver" in window){
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add("motion-visible");
          observer.unobserve(entry.target);
        }
      });
    },{threshold:.08,rootMargin:"0px 0px -30px 0px"});
    revealTargets.forEach(node=>observer.observe(node));
  }else revealTargets.forEach(node=>node.classList.add("motion-visible"));
  const grid=document.getElementById("projectGrid");
  if(grid&&"MutationObserver" in window){
    let previous=grid.querySelectorAll(".project-card").length;
    new MutationObserver(()=>{
      const current=grid.querySelectorAll(".project-card").length;
      if(current!==previous){
        previous=current;
        const counter=document.getElementById("projectCount");
        if(counter){counter.dataset.count=String(current);countUp(counter,current);}
        grid.querySelectorAll(".project-card").forEach((card,i)=>{
          card.classList.remove("motion-visible");
          card.style.setProperty("--motion-delay",(i%6)*65+"ms");
          requestAnimationFrame(()=>card.classList.add("motion-visible"));
        });
      }
    }).observe(grid,{childList:true,subtree:true});
  }
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>setTimeout(run,80),{once:true});
else setTimeout(run,80);
})();