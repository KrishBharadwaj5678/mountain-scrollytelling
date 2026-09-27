/* =========================================
   DOM
========================================= */

const canvas = document.querySelector("#frame");

const context = canvas.getContext("2d");

const loader = document.querySelector("#loader");

const loaderPercentage = document.querySelector("#loaderPercentage");

const loaderProgress = document.querySelector("#loaderProgress");

const progressBar = document.querySelector("#progressBar");

const progressText = document.querySelector("#progressText");

const chapter = document.querySelector("#chapter");

const stories = document.querySelectorAll(".story");

const hotspots = document.querySelectorAll(".hotspot");

const parallaxElements = document.querySelectorAll(".parallax");

/* =========================================
   FRAME SETTINGS
========================================= */

const frames = {
  currentIndex: 0,
  maxIndex: 727,
};

let images = [];

let imageLoaded = 0;

let activeStory = -1;

/* =========================================
   CUSTOM CURSOR
========================================= */

const cursor = document.querySelector("#cursor");

const cursorFollower = document.querySelector("#cursorFollower");

let mouseX = 0;
let mouseY = 0;

let followerX = 0;
let followerY = 0;

/* Mouse */

window.addEventListener("mousemove", (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;

  gsap.to(cursor, {
    x: mouseX,
    y: mouseY,
    duration: 0.08,
    ease: "power2.out",
  });
});

/* Cursor follower */

gsap.ticker.add(() => {
  followerX += (mouseX - followerX) * 0.12;

  followerY += (mouseY - followerY) * 0.12;

  gsap.set(cursorFollower, {
    x: followerX,
    y: followerY,
  });
});

/* Cursor hover */

const interactiveElements = document.querySelectorAll(
  ".hotspot, #progressText",
);

interactiveElements.forEach((element) => {
  element.addEventListener("mouseenter", () => {
    document.body.classList.add("cursor-hover");
  });

  element.addEventListener("mouseleave", () => {
    document.body.classList.remove("cursor-hover");
  });
});

/* =========================================
   PRELOAD IMAGES
========================================= */

const preloadImages = () => {
  for (let i = 1; i <= frames.maxIndex; i++) {
    const imageURL = `./assets/frames/frame_${String(i).padStart(4, "0")}.jpg`;

    const img = new Image();

    img.src = imageURL;

    img.onload = () => {
      imageLoaded++;

      updateLoader();
    };

    img.onerror = () => {
      imageLoaded++;

      updateLoader();
    };

    images.push(img);
  }
};

/* =========================================
   LOADER
========================================= */

const updateLoader = () => {
  const percent = Math.floor((imageLoaded / frames.maxIndex) * 100);

  loaderPercentage.textContent = `${percent}%`;

  loaderProgress.style.width = `${percent}%`;

  if (imageLoaded === frames.maxIndex) {
    loadImages(frames.currentIndex);

    startAnimation();

    hideLoader();
  }
};

/* =========================================
   HIDE LOADER
========================================= */

const hideLoader = () => {
  const tl = gsap.timeline();

  tl.to("#loaderTitle", {
    y: -30,
    opacity: 0,
    duration: 0.5,
    ease: "power2.out",
  })

    .to(
      "#loaderPercentage",
      {
        y: -20,
        opacity: 0,
        duration: 0.4,
        ease: "power2.out",
      },
      "-=0.3",
    )

    .to(
      ".loader-line",
      {
        opacity: 0,
        duration: 0.3,
      },
      "-=0.2",
    )

    .to(loader, {
      opacity: 0,
      duration: 1,
      ease: "power3.inOut",

      onComplete: () => {
        loader.style.display = "none";
      },
    });
};

/* =========================================
   DRAW FRAME
========================================= */

const loadImages = (index) => {
  if (index < 0 || index >= images.length) {
    return;
  }

  const img = images[index];

  if (!img || !img.complete) {
    return;
  }

  /* Canvas size */

  canvas.width = window.innerWidth;

  canvas.height = window.innerHeight;

  /* Cover image */

  const scale = Math.max(canvas.width / img.width, canvas.height / img.height);

  const newWidth = img.width * scale;

  const newHeight = img.height * scale;

  const offsetX = (canvas.width - newWidth) / 2;

  const offsetY = (canvas.height - newHeight) / 2;

  /* Draw */

  context.clearRect(0, 0, canvas.width, canvas.height);

  context.imageSmoothingEnabled = true;

  context.imageSmoothingQuality = "high";

  context.drawImage(img, offsetX, offsetY, newWidth, newHeight);

  frames.currentIndex = index;
};

/* =========================================
   GSAP TEXT ANIMATION
========================================= */

const animateText = (progress) => {
  const activeIndex = Math.min(
    Math.floor(progress * stories.length),
    stories.length - 1,
  );

  /* Same story */

  if (activeIndex === activeStory) {
    return;
  }

  activeStory = activeIndex;

  stories.forEach((story, index) => {
    const heading = story.querySelector("h2");

    const paragraph = story.querySelector("p");

    const number = story.querySelector(".story-number");

    gsap.killTweensOf([story, heading, paragraph, number]);

    /* ======================
         ACTIVE STORY
      ====================== */
    /* =========================
   ACTIVE STORY
========================= */

    if (index === activeIndex) {
      gsap.set(story, {
        opacity: 1,
        visibility: "visible",
      });

      /* Entire text block */

      gsap.fromTo(
        story,
        {
          x: -40,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
        },
      );

      /* Chapter */

      gsap.fromTo(
        number,
        {
          y: 15,
          opacity: 0,
          letterSpacing: "0.5em",
        },
        {
          y: 0,
          opacity: 1,
          letterSpacing: "0.35em",
          duration: 0.7,
          delay: 0.05,
          ease: "power3.out",
        },
      );

      /* Main heading */

      gsap.fromTo(
        heading,
        {
          y: 70,
          opacity: 0,
          filter: "blur(10px)",
          scale: 0.96,
        },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          scale: 1,
          duration: 1.1,
          delay: 0.12,
          ease: "power4.out",
        },
      );

      /* Description */

      gsap.fromTo(
        paragraph,
        {
          y: 25,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.35,
          ease: "power3.out",
        },
      );
    } else {
      /* ======================
           OTHER STORIES
        ====================== */

      gsap.to(story, {
        x: 35,
        opacity: 0,
        duration: 0.45,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(story, {
            visibility: "hidden",
          });
        },
      });
    }
  });
};

/* =========================================
   PARALLAX
========================================= */

const updateParallax = (progress) => {
  parallaxElements.forEach((element) => {
    const speed = parseFloat(element.dataset.speed);

    const movement = progress * window.innerHeight * speed;

    const rotation = progress * 180 * speed;

    gsap.to(
      element,

      {
        y: movement,
        rotation: rotation,

        duration: 0.6,

        overwrite: true,

        ease: "power2.out",
      },
    );
  });
};

/* =========================================
   HOTSPOTS
========================================= */

const updateHotspots = (progress) => {
  hotspots.forEach((hotspot) => {
    const start = parseFloat(hotspot.dataset.start);

    const end = parseFloat(hotspot.dataset.end);

    if (progress >= start && progress <= end) {
      const localProgress = (progress - start) / (end - start);

      const scale = 0.5 + Math.sin(localProgress * Math.PI) * 0.5;

      gsap.to(
        hotspot,

        {
          opacity: 1,
          scale: scale,

          duration: 0.4,

          ease: "power2.out",
        },
      );
    } else {
      gsap.to(
        hotspot,

        {
          opacity: 0,
          scale: 0.5,

          duration: 0.4,

          ease: "power2.out",
        },
      );
    }
  });
};

/* =========================================
   CHAPTER
========================================= */

const updateChapter = (progress) => {
  let currentChapter = "INTRODUCTION";

  if (progress >= 0.25) {
    currentChapter = "DESIGN";
  }

  if (progress >= 0.5) {
    currentChapter = "EXPERIENCE";
  }

  if (progress >= 0.75) {
    currentChapter = "FUTURE";
  }

  if (chapter.textContent !== currentChapter) {
    gsap.to(
      chapter,

      {
        opacity: 0,
        y: 10,

        duration: 0.2,

        onComplete: () => {
          chapter.textContent = currentChapter;

          gsap.to(
            chapter,

            {
              opacity: 1,
              y: 0,
              duration: 0.4,
            },
          );
        },
      },
    );
  }
};

/* =========================================
   START SCROLL ANIMATION
========================================= */

const startAnimation = () => {
  gsap.registerPlugin(ScrollTrigger);

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".parent",

      start: "top top",

      end: "bottom bottom",

      scrub: 2,

      onUpdate: (self) => {
        const progress = self.progress;

        /* Progress */

        const percentage = Math.round(progress * 100);

        progressBar.style.width = `${percentage}%`;

        progressText.textContent = `${percentage}%`;

        /* Text */

        animateText(progress);

        /* Parallax */

        updateParallax(progress);

        /* Hotspots */

        updateHotspots(progress);

        /* Chapter */

        updateChapter(progress);
      },
    },
  });

  /* Canvas frame animation */

  timeline.to(
    frames,

    {
      currentIndex: frames.maxIndex - 1,

      ease: "none",

      onUpdate: () => {
        loadImages(Math.floor(frames.currentIndex));
      },
    },
  );
};

/* =========================================
   RESIZE
========================================= */

window.addEventListener("resize", () => {
  if (images.length) {
    loadImages(Math.floor(frames.currentIndex));
  }

  if (typeof ScrollTrigger !== "undefined") {
    ScrollTrigger.refresh();
  }
});

/* =========================================
   START
========================================= */

preloadImages();
