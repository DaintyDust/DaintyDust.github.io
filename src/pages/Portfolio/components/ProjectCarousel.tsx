import { useState } from "react";
import { Carousel } from "@mantine/carousel";
import { Compare } from "@gfazioli/mantine-compare";
import { lightbox } from "@mantine/lightbox";
import { IconArrowsMaximize } from "@tabler/icons-react";
import "@mantine/carousel/styles.css";
import "@gfazioli/mantine-compare/styles.css";
import type { ProjectMediaItem, ProjectImageCompare } from "../types";

interface ProjectCarouselProps {
  images: ProjectMediaItem[];
  title: string;
}

function isCompareItem(item: ProjectMediaItem): item is ProjectImageCompare {
  return typeof item === "object" && item !== null && item.type === "compare";
}

export default function ProjectCarousel({ images, title }: ProjectCarouselProps) {
  const [activeSlide, setActiveSlide] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const lightboxSlides = images
    .filter((item) => !isCompareItem(item))
    .map((item, i) => ({
      src: item as string,
      alt: `${title} slide ${i + 1}`,
    }));

  const openLightbox = (carouselIndex: number) => {
    if (lightboxSlides.length === 0) return;

    let lbIndex = 0;
    let lbCount = 0;
    for (let i = 0; i < images.length; i++) {
      if (!isCompareItem(images[i])) {
        if (i === carouselIndex) {
          lbIndex = lbCount;
          break;
        }
        lbCount++;
      }
    }
    lightbox.open({ slides: lightboxSlides, startIndex: lbIndex });
  };

  const renderMediaItem = (item: ProjectMediaItem, index: number) => {
    if (isCompareItem(item)) {
      return (
        <div className="project-carousel-compare-wrapper">
          <Compare
            aspectRatio="16/9"
            radius={0}
            sliderColor="#00b4d8"
            classNames={{
              root: "project-carousel-compare",
              slider: "project-compare-slider",
              sliderButton: "project-compare-slider-button",
              sliderLine: "project-compare-slider-line",
            }}
            leftSection={<img src={item.beforeImage} alt={item.beforeLabel || `${title} Before`} className="project-carousel-image" loading={index === 0 ? "eager" : "lazy"} />}
            rightSection={<img src={item.afterImage} alt={item.afterLabel || `${title} After`} className="project-carousel-image" loading="lazy" />}
            leftLabel={item.beforeLabel || "Before"}
            rightLabel={item.afterLabel || "After"}
          />
        </div>
      );
    }

    return <img src={item} alt={`${title} slide ${index + 1}`} className="project-carousel-image" loading={index === 0 ? "eager" : "lazy"} />;
  };

  if (images.length === 1) {
    const singleItem = images[0];
    if (isCompareItem(singleItem)) {
      return (
        <div className="project-image-wrapper">
          <Compare
            aspectRatio="16/9"
            radius={0}
            sliderColor="#00b4d8"
            classNames={{
              root: "project-carousel-compare",
              slider: "project-compare-slider",
              sliderButton: "project-compare-slider-button",
              sliderLine: "project-compare-slider-line",
            }}
            leftSection={<img src={singleItem.beforeImage} alt={singleItem.beforeLabel || `${title} Before`} className="project-image" />}
            rightSection={<img src={singleItem.afterImage} alt={singleItem.afterLabel || `${title} After`} className="project-image" />}
            leftLabel={singleItem.beforeLabel || "Before"}
            rightLabel={singleItem.afterLabel || "After"}
          />
        </div>
      );
    }

    return (
      <div className="project-image-wrapper" style={{ position: "relative" }}>
        <img src={singleItem} alt={title} className="project-image" />
        <button type="button" className="project-lightbox-btn visible" onClick={() => openLightbox(0)} aria-label="Open fullscreen">
          <IconArrowsMaximize size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="project-carousel-wrapper" onClick={(e) => e.stopPropagation()}>
      <Carousel
        height="100%"
        emblaOptions={{
          loop: true,
          watchDrag: (_emblaApi, evt) => {
            const target = evt.target as HTMLElement | null;
            if (!target) return true;
            // Disable carousel drag when dragging the image compare slider handle or divider
            if (target.closest(".project-compare-slider, .project-compare-slider-button, .project-compare-slider-line, [role='slider'], [class*='sliderButton'], [class*='sliderLine']")) {
              return false;
            }
            return true;
          },
        }}
        withIndicators
        withControls
        previousControlProps={{
          "aria-label": "Previous slide",
          onClick: (e) => e.stopPropagation(),
        }}
        nextControlProps={{
          "aria-label": "Next slide",
          onClick: (e) => e.stopPropagation(),
        }}
        onSlideChange={setActiveSlide}
        classNames={{
          root: "project-carousel",
          slide: "project-carousel-slide",
          control: "project-carousel-control",
          controls: "project-carousel-controls",
          indicator: "project-carousel-indicator",
          indicators: "project-carousel-indicators",
        }}
      >
        {images.map((item, index) => (
          <Carousel.Slide key={index}>{renderMediaItem(item, index)}</Carousel.Slide>
        ))}
      </Carousel>

      <div className="project-carousel-counter">
        {activeSlide + 1} / {images.length}
      </div>

      {!isCompareItem(images[activeSlide]) && lightboxSlides.length > 0 && (
        <button type="button" className="project-lightbox-btn" onClick={() => openLightbox(activeSlide)} aria-label="Open fullscreen">
          <IconArrowsMaximize size={14} />
        </button>
      )}
    </div>
  );
}
