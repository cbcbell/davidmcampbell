import * as Lightbox from "@ramka/react/lightbox"
import { useEffect, useRef, useState } from "react"
import closeIcon from "../assets/icons/close.svg?url"
import previousIcon from "../assets/icons/chevron-left.svg?url"
import nextIcon from "../assets/icons/chevron-right.svg?url"
import expandIcon from "../assets/icons/expand.svg?url"
import minimizeIcon from "../assets/icons/minimize.svg?url"
import gridIcon from "../assets/icons/filmstrip.svg?url"
import "./GalleryViewer.css"

type GalleryImage = {
  src: string
  thumbnail: string
  width: number
  height: number
  title: string
  description: string
}

type Props = { images: GalleryImage[]; title: string }

export default function GalleryViewer({ images, title }: Props) {
  const [showThumbnails, setShowThumbnails] = useState(false)
  const [thumbnailsMounted, setThumbnailsMounted] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [fullscreenAvailable, setFullscreenAvailable] = useState(false)
  const enteredFullscreen = useRef(false)

  useEffect(() => {
    setFullscreenAvailable(!!document.fullscreenEnabled)
    const updateFullscreen = () => {
      setFullscreen(!!document.fullscreenElement)
      if (!document.fullscreenElement) enteredFullscreen.current = false
    }
    updateFullscreen()
    document.addEventListener("fullscreenchange", updateFullscreen)
    return () =>
      document.removeEventListener("fullscreenchange", updateFullscreen)
  }, [])

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      void document.exitFullscreen()
    } else {
      void document.documentElement
        .requestFullscreen()
        .then(() => {
          enteredFullscreen.current = true
        })
        .catch(() => {})
    }
  }

  return (
    <Lightbox.Root
      count={images.length}
      loop
      scrollTriggerIntoView={{ type: "onChange", behavior: "instant" }}
      onOpenChange={(open) => {
        if (!open) {
          setShowThumbnails(false)
          setThumbnailsMounted(false)
          if (enteredFullscreen.current && document.fullscreenElement) {
            void document.exitFullscreen()
          }
        }
      }}
    >
      <section
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 md:gap-7 lg:gap-10 xl:grid-cols-5 2xl:grid-cols-6 2xl:gap-12"
        aria-label={title}
      >
        {images.map((image, i) => (
          <Lightbox.Trigger
            key={image.src}
            index={i}
            className="gallery-trigger aspect-square overflow-hidden bg-neutral-100 focus-visible:outline-offset-3"
            aria-label={`View ${image.title}`}
            render={
              <a href={image.src} onClick={(event) => event.preventDefault()} />
            }
          >
            {({ imageRef, morphRef }) => (
              <>
                <img
                  ref={(element) => {
                    imageRef(element)
                    morphRef(element)
                  }}
                  src={image.thumbnail}
                  width={image.width}
                  height={image.height}
                  alt={image.title}
                  className="h-full w-full object-cover transition-opacity duration-200 hover:opacity-85"
                  loading={i < 8 ? "eager" : "lazy"}
                />
              </>
            )}
          </Lightbox.Trigger>
        ))}
      </section>
      <Lightbox.Portal>
        <Lightbox.Backdrop className="gallery-backdrop" />
        <Lightbox.Content
          className={
            showThumbnails
              ? "gallery-viewer gallery-viewer-thumbnails"
              : "gallery-viewer"
          }
          aria-label={`${title} Gallery`}
        >
          <Lightbox.Counter className="gallery-counter" />
          <Lightbox.Slides
            className="gallery-slides"
            aria-label={title}
            aria-roledescription="carousel"
          >
            {images.map((image, i) => (
              <Lightbox.Slide className="gallery-slide" key={image.src}>
                <Lightbox.Item
                  index={i}
                  caption={
                    <>
                      <span className="gallery-caption-title">{image.title}</span>
                      {image.description && <span className="gallery-caption-description">{image.description}</span>}
                    </>
                  }
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${images.length}`}
                >
                  <Lightbox.Zoom>
                    <Lightbox.Media width={image.width} height={image.height}>
                      <img
                        src={image.src}
                        width={image.width}
                        height={image.height}
                        alt={image.title}
                      />
                    </Lightbox.Media>
                  </Lightbox.Zoom>
                </Lightbox.Item>
              </Lightbox.Slide>
            ))}
          </Lightbox.Slides>
          <div className="gallery-toolbar">
            {fullscreenAvailable && (
              <button
                className="gallery-control gallery-fullscreen"
                type="button"
                onClick={toggleFullscreen}
                aria-label={fullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              >
                <img src={fullscreen ? minimizeIcon : expandIcon} alt="" />
              </button>
            )}
            <button
              className="gallery-control"
              type="button"
              onClick={() => {
                if (!showThumbnails) setThumbnailsMounted(true)
                setShowThumbnails((visible) => !visible)
              }}
              aria-label="Toggle Thumbnails"
              aria-pressed={showThumbnails}
            >
              <img src={gridIcon} alt="" />
            </button>
            <Lightbox.Close className="gallery-control" aria-label="Close">
              <img src={closeIcon} alt="" />
            </Lightbox.Close>
          </div>
          {images.length > 1 && (
            <>
              <Lightbox.Previous
                className="gallery-control gallery-previous"
                aria-label="Previous Image"
              >
                <img src={previousIcon} alt="" />
              </Lightbox.Previous>
              <Lightbox.Next
                className="gallery-control gallery-next"
                aria-label="Next Image"
              >
                <img src={nextIcon} alt="" />
              </Lightbox.Next>
            </>
          )}
          <Lightbox.Caption className="gallery-caption" />
          {thumbnailsMounted && (
            <div
              className="gallery-thumbnails"
              data-visible={showThumbnails}
              aria-hidden={!showThumbnails}
              inert={!showThumbnails}
              onTransitionEnd={(event) => {
                if (
                  event.target === event.currentTarget &&
                  event.propertyName === "opacity" &&
                  !showThumbnails
                ) {
                  setThumbnailsMounted(false)
                }
              }}
            >
              <Lightbox.ThumbnailStrip>
                <Lightbox.ThumbnailStripTrack
                  className="gallery-thumbnails-track"
                  aria-label="Gallery Thumbnails"
                >
                  {images.map((image, i) => (
                    <Lightbox.Thumbnail
                      key={image.src}
                      index={i}
                      className="gallery-thumbnail"
                      aria-label={`View Image ${i + 1}`}
                    >
                      <img
                        src={image.thumbnail}
                        alt=""
                        loading="lazy"
                      />
                    </Lightbox.Thumbnail>
                  ))}
                </Lightbox.ThumbnailStripTrack>
              </Lightbox.ThumbnailStrip>
            </div>
          )}
        </Lightbox.Content>
      </Lightbox.Portal>
    </Lightbox.Root>
  )
}
