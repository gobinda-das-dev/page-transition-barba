const overlayPath = document.querySelector('.overlay__path');
const crrP = document.querySelector('.transition .current-page');

let isAnimating = false;

const paths = {
   step1: {
      unfilled: 'M 0 100 V 100 Q 50 100 100 100 V 100 z',
      inBetween: {
         curve1: 'M 0 100 V 70 Q 50 -120 100 70 V 100 z',
         curve2: 'M 0 100 V 50 Q 50 100 100 50 V 100 z'
      },
      filled: 'M 0 100 V 0 Q 50 0 100 0 V 100 z',
   },
   step2: {
      filled: 'M 0 0 V 100 Q 50 100 100 100 V 0 z',
      inBetween: {
         curve1: 'M 0 0 V 100 Q 50 0 100 100 V 0 z',
         curve2: 'M 0 0 V 50 Q 50 100 100 50 V 0 z'
      },
      unfilled: 'M 0 0 V 0 Q 50 0 100 0 V 0 z',
   }
};

const revealEnter = (tl) => {
   tl
      .set(overlayPath, { attr: { d: paths.step1.unfilled }})
      .set(crrP, { y: '100%', scale: 0.9, opacity: 1 })
      
      .to(overlayPath, {
         duration: 1,
         ease: 'power4.in',
         attr: { d: paths.step1.inBetween.curve1 }
      }, 0)
      .to(overlayPath, {
         duration: 0.4,
         ease: 'power1.out',
         attr: { d: paths.step1.filled },
         //? --- Page change occurs here ---
      }, '-=0.1');
}

const revealExit = (tl, con) => {
   tl
      .set(overlayPath, { attr: { d: paths.step2.filled } })
      .set(con, { opacity: 0 })      

      .to(overlayPath, {
         duration: 0.2,
         ease: 'sine.in',
         attr: { d: paths.step2.inBetween.curve1 }
      })
      .to(overlayPath, {
         duration: 1,
         ease: 'power4',
         attr: { d: paths.step2.unfilled }
      })
      
      .to(crrP, {
         duration: 1,
         ease: 'expo',
         y: 0,
      }, '<')
      .to(crrP, {
         scale: 1,
         duration: 1,
         ease: 'expo.inOut',
      }, '-=0.5')
      .set(con, { opacity: 1 })
      .to(crrP, { opacity: 0, duration: 0.2 });
}

const unRevealEnter = (tl) => {
   tl
      .set(overlayPath, { attr: { d: paths.step2.unfilled } })
      .set(crrP, { y: '-100%', scale: 0.9, opacity: 1 })

      .to(overlayPath, {
         duration: 0.8,
         ease: 'power4.in',
         attr: { d: paths.step2.inBetween.curve2 }
      }, 0)
      .to(overlayPath, {
         duration: 0.2,
         ease: 'power1',
         attr: { d: paths.step2.filled },
         //? --- Page change occurs here ---
      });
}

const unRevealExit = (tl, con) => {
   tl
      .set(overlayPath, { attr: { d: paths.step1.filled }})
      .set(con, { opacity: 0 })
      
      .to(overlayPath, {
         duration: 0.2,
         ease: 'sine.in',
         attr: { d: paths.step1.inBetween.curve2 }
      })
      .to(overlayPath, {
         duration: 1,
         ease: 'power4',
         attr: { d: paths.step1.unfilled }
      })

      .to(crrP, {
         duration: 1,
         ease: 'expo',
         y: 0,
      }, '<-0.1')
      .to(crrP, {
         scale: 1,
         duration: 1,
         ease: 'expo.inOut',
      }, '-=0.5')
      .set(con, { opacity: 1 })
      .to(crrP, { opacity: 0, duration: 0.2 });
}



barba.init({
   transitions: {
      leave(data) {
         const tg = data.trigger; // backword or forword
         if (isAnimating) return;
         isAnimating = true;
         const tl = gsap.timeline().timeScale(0.8);


         if(tg == 'back' || tg == 'popstate') {
            unRevealEnter(tl);
         } else {
            revealEnter(tl);
         }

         return tl;
      },
      enter(data) {
         const con = data.next.container; // opened container
         const tg = data.trigger; // backword or forword
         const tl = gsap.timeline({
            onComplete: () => isAnimating = false
         }).timeScale(0.8)

         if(tg == 'back' || tg == 'popstate') {
            unRevealExit(tl, con);
         } else {
            revealExit(tl, con);
         }
      }
   }
})