/* ============================================================
   Portfolio JS
   Extras included:
   1) Dark mode toggle (with localStorage)
   2) Responsive hamburger menu
   3) Scroll-to-top button
   4) Reveal-on-scroll animations (IntersectionObserver)
   5) Projects filter (on projects page)
   6) Contact form validation + success message
   ============================================================ */

(function(){
  "use strict";

  const root = document.documentElement;
  const themeBtn = document.querySelector("[data-theme-toggle]");
  const menuBtn = document.querySelector("[data-menu-toggle]");
  const mobilePanel = document.getElementById("mobilePanel");
  const toTopBtn = document.getElementById("toTop");

  // ---------------- Theme ----------------
  function setTheme(theme){
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    if(themeBtn){
      themeBtn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
      themeBtn.setAttribute("title", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    }
  }
  const savedTheme = localStorage.getItem("theme");
  if(savedTheme === "dark" || savedTheme === "light"){
    setTheme(savedTheme);
  }else{
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");
  }
  if(themeBtn){
    themeBtn.addEventListener("click", function(){
      const current = root.getAttribute("data-theme");
      setTheme(current === "dark" ? "light" : "dark");
    });
  }

  // ---------------- Mobile Menu ----------------
  if(menuBtn && mobilePanel){
    menuBtn.addEventListener("click", function(){
      const expanded = menuBtn.getAttribute("aria-expanded") === "true";
      menuBtn.setAttribute("aria-expanded", expanded ? "false" : "true");
      mobilePanel.hidden = expanded;
      if(!expanded){
        const firstLink = mobilePanel.querySelector("a");
        if(firstLink){ firstLink.focus(); }
      }
    });
  }

  // ---------------- Scroll to top ----------------
  if(toTopBtn){
    window.addEventListener("scroll", function(){
      const show = window.scrollY > 500;
      toTopBtn.style.display = show ? "inline-flex" : "none";
    });
    toTopBtn.addEventListener("click", function(){
      window.scrollTo({top:0, behavior:"smooth"});
    });
  }

  // ---------------- Reveal animations ----------------
  const revealEls = document.querySelectorAll(".reveal");
  if("IntersectionObserver" in window){
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    }, {threshold:0.15});
    revealEls.forEach(el=>obs.observe(el));
  }else{
    revealEls.forEach(el=>el.classList.add("visible"));
  }

  // ---------------- Projects filtering (projects.html) ----------------
  const chips = document.querySelectorAll("[data-filter]");
  const projects = document.querySelectorAll("[data-project]");
  if(chips.length && projects.length){
    function applyFilter(category){
      chips.forEach(c=>{
        c.setAttribute("aria-pressed", c.getAttribute("data-filter") === category ? "true" : "false");
      });
      projects.forEach(p=>{
        const cat = p.getAttribute("data-project");
        p.style.display = (category === "all" || category === cat) ? "block" : "none";
      });
    }
    chips.forEach(chip=>{
      chip.addEventListener("click", ()=>applyFilter(chip.getAttribute("data-filter")));
    });
    applyFilter("all");
  }

  // ---------------- Contact form validation (contact.html) ----------------
  const form = document.getElementById("contactForm");
  if(form){
    const nameEl = document.getElementById("name");
    const emailEl = document.getElementById("email");
    const msgEl = document.getElementById("message");
    const successBox = document.getElementById("successBox");

    function showError(id, msg){
      const el = document.getElementById(id);
      if(el){
        el.textContent = msg;
        el.style.display = "block";
      }
    }
    function clearErrors(){
      document.querySelectorAll(".error").forEach(e=>{ e.style.display="none"; e.textContent=""; });
    }
    function validEmail(value){
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    form.addEventListener("submit", function(e){
      e.preventDefault();
      clearErrors();
      let ok = true;

      if(!nameEl.value.trim()){
        ok = false;
        showError("nameError", "Please enter your name.");
      }
      if(!emailEl.value.trim() || !validEmail(emailEl.value.trim())){
        ok = false;
        showError("emailError", "Please enter a valid email address.");
      }
      if(!msgEl.value.trim() || msgEl.value.trim().length < 10){
        ok = false;
        showError("messageError", "Message should be at least 10 characters.");
      }

      if(ok){
        successBox.style.display = "block";
        form.reset();
        successBox.scrollIntoView({behavior:"smooth", block:"nearest"});
      }
    });
  }
})();
