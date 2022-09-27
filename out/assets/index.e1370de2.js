(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))c(e);new MutationObserver(e=>{for(const r of e)if(r.type==="childList")for(const n of r.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&c(n)}).observe(document,{childList:!0,subtree:!0});function s(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerpolicy&&(r.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?r.credentials="include":e.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function c(e){if(e.ep)return;e.ep=!0;const r=s(e);fetch(e.href,r)}})();function l(o,t){o===0?console.log(t):o===1?console.warn(t):o===2&&console.error(t)}function i(o,t){l(o,t)}function f(o){i(0,o)}function u(o){i(2,o)}function d(o){i(1,o)}f("123");d("123");u("234");document.querySelector("#app").innerHTML=`
  <div>
    <div>canvas UI 11111</div>
  </div>
`;
