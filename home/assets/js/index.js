// ! navbar
  const navbar = document.querySelector(".navbar");
  const firstSection = document.getElementById("home");

  window.addEventListener("scroll", () => {
    let sectionHeight = firstSection.offsetHeight;
    let currentScroll = window.pageYOffset;

    if (currentScroll <= sectionHeight) {
     
      navbar.style.top = "0";
    } else {
     
      navbar.style.top = "-80px";
    }
  });

// ! BACKGROUND ANINATIOM
VANTA.GLOBE({
  el: "#vanta-bg",
  mouseControls: true,
  touchControls: true,
  gyroControls: false,
  minHeight: 200.00,
  minWidth: 200.00,
  scale: 1.00,
  scaleMobile: 1.00,
  color: 0x547792,
  backgroundColor: 0x0
})
VANTA.NET({
  el: "#works",
  mouseControls: true,
  touchControls: true,
  gyroControls: false,
  minHeight: 200.00,
  minWidth: 200.00,
  scale: 1.00,
  scaleMobile: 1.00,
  color: 0x324657,
  backgroundColor: 0x213448
})
// VANTA.NET({
//   el: "#count",
//   mouseControls: true,
//   touchControls: true,
//   gyroControls: false,
//   minHeight: 200.00,
//   minWidth: 200.00,
//   scale: 1.00,
//   scaleMobile: 1.00,
//   color: 0x213448,
//   backgroundColor: 0xECEFCA
// })
// !COUNTER
  const counters = document.querySelectorAll('.stat-number');

    const animateCounter = (el) => {
      const target = +el.getAttribute('data-target');
      const speed = 80;
      let count = 0;
      const update = () => {
        const increment = Math.ceil(target / 100);
        if(count < target){
          count += increment;
          el.textContent = count.toLocaleString();
          setTimeout(update, speed);
        } else {
          el.textContent = target.toLocaleString();
        }
      };
      update();
    };
// ^ ANIMATION
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          const box = entry.target;
          box.classList.add('visible');
          animateCounter(box.querySelector('.stat-number'));
          observer.unobserve(box);
        }
      });
    }, { threshold:0.5 });

    document.querySelectorAll('.stat-box').forEach(box => observer.observe(box));
// ! HTML ELEMENTS
const plus = document.querySelectorAll(".accordion-header img");
const text = document.querySelectorAll(".accordion-content p");

function show(index) {
  
   
    text[index].classList.toggle("d-none");
  
}

for (let j = 0; j < plus.length; j++) {
    plus[j].addEventListener("click", function() {
        show(j);
        plus[j].classList.toggle("rotate");
        
    });
}




