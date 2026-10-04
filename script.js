const system = document.querySelector(".system");

const lines = [
  document.querySelector(".line-a"),
  document.querySelector(".line-b"),
  document.querySelector(".line-c")
];

const platforms = [
  document.querySelector(".autocad"),
  document.querySelector(".sketchup"),
  document.querySelector(".indesign")
];

const project = document.querySelector(".project");

const copyProject =
  document.querySelector(".copy-project");

const copyPlatforms =
  document.querySelector(".copy-platforms");

const scrollHint =
  document.querySelector(".scroll-hint");


function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}


function ease(value) {
  return value * value * (3 - 2 * value);
}


function sectionProgress() {

  const start = system.offsetTop;

  const range =
    system.offsetHeight - window.innerHeight;

  return clamp(
    (window.scrollY - start) / range
  );
}


function range(progress, start, end) {

  return clamp(
    (progress - start) / (end - start)
  );
}


function setLineProgress(line, progress) {

  const length = 1000;

  line.style.strokeDashoffset =
    String(length * (1 - ease(progress)));
}


function update() {

  const p = sectionProgress();


  /*
    The project remains central
    while the system gradually opens.
  */

  const lineProgress =
    ease(range(p, 0.08, 0.72));


  lines.forEach((line) => {

    setLineProgress(
      line,
      lineProgress
    );

  });


  /*
    Platforms arrive sequentially.
  */

  const platformStarts = [
    0.38,
    0.47,
    0.56
  ];


  platforms.forEach((platform, i) => {

    const opacity =
      ease(
        range(
          p,
          platformStarts[i],
          platformStarts[i] + 0.14
        )
      );


    platform.style.opacity =
      String(opacity);


    platform.style.transform =
      `translate(
        -50%,
        calc(-50% + ${20 * (1 - opacity)}px)
      )`;

  });


  /*
    Small explanatory labels.
  */

  copyProject.style.opacity =
    String(
      ease(
        range(p, 0.02, 0.18)
      )
    );


  copyPlatforms.style.opacity =
    String(
      ease(
        range(p, 0.68, 0.86)
      )
    );


  /*
    Project becomes slightly smaller
    as the system expands.
  */

  const projectScale =
    1 -
    0.12 *
    ease(
      range(p, 0.18, 0.72)
    );


  project.style.transform =
    `translate(-50%, -50%)
     scale(${projectScale})`;


  /*
    Hide SCROLL after the animation begins.
  */

  scrollHint.style.opacity =
    String(
      1 -
      ease(
        range(p, 0.02, 0.12)
      )
    );
}


let ticking = false;


function requestUpdate() {

  if (!ticking) {

    requestAnimationFrame(() => {

      update();

      ticking = false;

    });

    ticking = true;
  }
}


window.addEventListener(
  "scroll",
  requestUpdate,
  { passive: true }
);


window.addEventListener(
  "resize",
  requestUpdate
);


update();
