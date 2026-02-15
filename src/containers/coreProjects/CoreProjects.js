import React, { useContext, useEffect, useRef, useState, useCallback } from "react";
import "../workExperience/WorkExperience.scss";
import ExperienceCard from "../../components/experienceCard/ExperienceCard";
import { coreProjects } from "../../portfolio";
import { Fade } from "react-reveal";
import StyleContext from "../../contexts/StyleContext";

// Helper: convert normal YouTube URLs to embed URL
function getYoutubeEmbedUrl(youtubeUrl) {
  if (!youtubeUrl) return null;
  try {
    const watchMatch = youtubeUrl.match(/[?&]v=([^&#]+)/);
    const shortMatch = youtubeUrl.match(/youtu\.be\/([^?&#]+)/);
    const embedMatch = youtubeUrl.match(/youtube\.com\/embed\/([^?&#]+)/);
    const videoId =
      (watchMatch && watchMatch[1]) ||
      (shortMatch && shortMatch[1]) ||
      (embedMatch && embedMatch[1]);
    if (!videoId) return null;
    return `https://www.youtube.com/embed/${videoId}?rel=0`;
  } catch (e) {
    return null;
  }
}

function normalizeArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  return [value];
}

function getMediaGroups(details, maxGroups = 5) {
  if (!details) return [];

  if (Array.isArray(details.imageGroups)) {
    return details.imageGroups
      .map((group) => ({
        title: group?.title || "",
        details: normalizeArray(group?.details),
        images: normalizeArray(group?.images),
      }))
      .filter(
        (group) =>
          group.title ||
          (group.details && group.details.length > 0) ||
          (group.images && group.images.length > 0)
      );
  }

  const groups = [];
  for (let i = 1; i <= maxGroups; i += 1) {
    const suffix = String(i).padStart(2, "0");
    const title = details[`title_${suffix}`];
    const detail = details[`detail_${suffix}`];
    const images = details[`images_${suffix}`];
    const normalizedDetails = normalizeArray(detail);
    const normalizedImages = normalizeArray(images);
    if (
      title ||
      (normalizedDetails && normalizedDetails.length > 0) ||
      (normalizedImages && normalizedImages.length > 0)
    ) {
      groups.push({
        title: title || "",
        details: normalizedDetails,
        images: normalizedImages,
      });
    }
  }
  return groups;
}

function linkifyDetailText(text, keyPrefix) {
  if (!text || typeof text !== "string") {
    return text;
  }

  const urlRegex =
    /((https?:\/\/|www\.)[^\s]+|[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  let segmentIndex = 0;

  while ((match = urlRegex.exec(text))) {
    const before = text.slice(lastIndex, match.index);
    if (before) {
      parts.push(before);
    }

    let url = match[0];
    let trailing = "";
    while (/[).,;:!?]$/.test(url)) {
      trailing = url.slice(-1) + trailing;
      url = url.slice(0, -1);
    }

    const href = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    parts.push(
      <a
        key={`detail-link-${keyPrefix}-${segmentIndex}-${match.index}`}
        href={href}
        target="_blank"
        rel="noreferrer"
      >
        {url}
      </a>
    );

    if (trailing) {
      parts.push(trailing);
    }

    segmentIndex += 1;
    lastIndex = match.index + match[0].length;
  }

  const remaining = text.slice(lastIndex);
  if (remaining) {
    parts.push(remaining);
  }

  if (parts.length === 1 && typeof parts[0] === "string") {
    return parts[0];
  }

  return parts;
}

export default function CoreProjects() {
  const { isDark } = useContext(StyleContext);

  const [expanded, setExpanded] = useState(null);
  const [showExpanded, setShowExpanded] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const dragStateRef = useRef({ startX: null, isDragging: false });

  useEffect(() => {
    if (expanded) {
      requestAnimationFrame(() => setShowExpanded(true));
    } else {
      setShowExpanded(false);
    }
  }, [expanded]);

  useEffect(() => {
    if (!showExpanded && expanded) {
      const timer = setTimeout(() => {
        setExpanded(null);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [showExpanded, expanded]);

  useEffect(() => {
    if (!expanded) {
      setLightboxIndex(null);
    }
  }, [expanded]);

  const currentDetails = expanded?.card?.details || null;

  const mediaGroups = getMediaGroups(currentDetails);
  const hasGroupedMedia = mediaGroups.length > 0;
  const groupImageOffsets = [];
  let groupImageTotal = 0;
  mediaGroups.forEach((group) => {
    groupImageOffsets.push(groupImageTotal);
    groupImageTotal += group.images.length;
  });

  const rawImages =
    currentDetails && Array.isArray(currentDetails.images)
      ? currentDetails.images.filter(Boolean)
      : [];
  const lightboxImages = hasGroupedMedia
    ? mediaGroups.flatMap((group) => group.images)
    : rawImages;

  const handlePrevImage = useCallback((event) => {
    if (event) event.stopPropagation();
    if (!lightboxImages.length) return;
    setLightboxIndex((prev) => {
      if (prev === null) return 0;
      return (prev - 1 + lightboxImages.length) % lightboxImages.length;
    });
  }, [lightboxImages.length]);

  const handleNextImage = useCallback((event) => {
    if (event) event.stopPropagation();
    if (!lightboxImages.length) return;
    setLightboxIndex((prev) => {
      if (prev === null) return 0;
      return (prev + 1) % lightboxImages.length;
    });
  }, [lightboxImages.length]);

  const handleOpenLightbox = (index) => {
    if (!lightboxImages.length) return;
    const safeIndex =
      typeof index === "number" && index >= 0
        ? Math.min(index, lightboxImages.length - 1)
        : 0;
    setLightboxIndex(safeIndex);
  };

  const startDrag = (clientX) => {
    dragStateRef.current = { startX: clientX, isDragging: true };
  };

  const endDrag = (clientX) => {
    const { startX, isDragging } = dragStateRef.current;
    dragStateRef.current = { startX: null, isDragging: false };
    if (!isDragging || startX === null) return;
    const delta = clientX - startX;
    const threshold = 50;
    if (Math.abs(delta) < threshold) return;
    if (delta > 0) {
      handlePrevImage();
    } else {
      handleNextImage();
    }
  };

  const handleMouseDown = (event) => {
    if (event.button !== 0) return;
    startDrag(event.clientX);
  };

  const handleMouseUp = (event) => {
    endDrag(event.clientX);
  };

  const handleMouseLeave = () => {
    dragStateRef.current = { startX: null, isDragging: false };
  };

  const handleTouchStart = (event) => {
    if (!event.touches || event.touches.length === 0) return;
    startDrag(event.touches[0].clientX);
  };

  const handleTouchEnd = (event) => {
    if (!event.changedTouches || event.changedTouches.length === 0) return;
    endDrag(event.changedTouches[0].clientX);
  };

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        handlePrevImage();
      } else if (event.key === "ArrowRight") {
        handleNextImage();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxIndex, handlePrevImage, handleNextImage]);

  if (!coreProjects.display) {
    return null;
  }

  const cards = Array.isArray(coreProjects.experience)
    ? coreProjects.experience
    : [];

  const handleOpenDetails = (card, extra) => {
    setExpanded({
      card,
      bannerColor: extra?.bannerColor || null,
    });
  };

  const handleCloseDetails = () => {
    setShowExpanded(false);
  };

  const handleBackdropClick = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(null);
      return;
    }
    handleCloseDetails();
  };

  const youtubeEmbedUrl =
    currentDetails && currentDetails.youtubeUrl
      ? getYoutubeEmbedUrl(currentDetails.youtubeUrl)
      : null;

  const mediaItems = [];
  if (!hasGroupedMedia && youtubeEmbedUrl) {
    mediaItems.push({ type: "video", key: "video" });
  }
  if (!hasGroupedMedia) {
    rawImages.forEach((src, idx) => {
      mediaItems.push({
        type: "image",
        src,
        key: `img-${idx}`,
        imageIndex: idx,
      });
    });
  }

  const hasMedia =
    Boolean(youtubeEmbedUrl) ||
    (hasGroupedMedia
      ? mediaGroups.some((group) => group.images.length > 0)
      : mediaItems.length > 0);

  return (
    <div id="core-projects">
      <Fade left duration={1000} distance="10rem">
        <div className="experience-container" id="coreProjects">
          <div>
            <h1
              className={
                isDark ? "dark-mode experience-heading" : "experience-heading"
              }
            >
              {coreProjects.title || "Core Projects"}
            </h1>
            {coreProjects.subtitle && (
              <p className={isDark ? "subTitle dark-mode-text" : "subTitle"}>
                {coreProjects.subtitle}
              </p>
            )}
            <div className="experience-cards-div">
              {cards.map((card, i) => (
                <ExperienceCard
                  key={i}
                  isDark={isDark}
                  cardInfo={{
                    company: card.company,
                    desc: card.desc,
                    date: card.date,
                    companylogo: card.companylogo,
                    role: card.role,
                    descBullets: card.descBullets,
                    coverImage: card.coverImage,
                    details: card.details,
                  }}
                  onOpenDetails={(extra) => handleOpenDetails(card, extra)}
                />
              ))}
            </div>
          </div>
        </div>

        <img src="/images/divider.png" alt="divider" className="img-divider" />
      </Fade>

      {expanded && (
        <>
          <div className="exp-expanded-backdrop" onClick={handleBackdropClick} />

          <div
            className={
              "experience-card " +
              (isDark ? "experience-card-dark " : "") +
              "exp-expanded-card " +
              (showExpanded ? "exp-expanded-card--visible" : "")
            }
          >
            <div
              className="experience-banner"
              style={{
                background: expanded.bannerColor || "#222",
              }}
            >
              <div className="experience-blurred_div" />
              <div className="experience-div-company">
                <h5 className="experience-text-company">
                  {expanded.card.company}
                </h5>
              </div>

              <img
                className="experience-roundedimg"
                src={expanded.card.companylogo}
                alt={expanded.card.company}
              />
            </div>

            <div className="experience-text-details exp-expanded-content">
              <h5 className="experience-text-role">{expanded.card.role}</h5>
              <h5 className="experience-text-date">{expanded.card.date}</h5>

              <p
                className={
                  isDark
                    ? "subTitle experience-text-desc dark-mode-text"
                    : "subTitle experience-text-desc"
                }
              >
                {expanded.card.details?.projectName || expanded.card.desc}
              </p>

              {currentDetails &&
                Array.isArray(currentDetails.overview) &&
                currentDetails.overview.map((p, idx) => (
                  <p
                    key={`ov-${idx}`}
                    className={
                      isDark
                        ? "exp-expanded-paragraph dark-mode-text"
                        : "exp-expanded-paragraph"
                    }
                  >
                    {p}
                  </p>
                ))}

              {currentDetails &&
                Array.isArray(currentDetails.responsibilities) &&
                currentDetails.responsibilities.length > 0 && (
                  <section className="exp-expanded-section">
                    <h4>Key responsibilities</h4>
                    <ul>
                      {currentDetails.responsibilities.map((item, idx) => (
                        <li
                          key={`resp-${idx}`}
                          className={isDark ? "dark-mode-text" : ""}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

              {currentDetails && currentDetails.technologies && (
                <p className="exp-expanded-technologies">
                  <strong>Technologies:&nbsp;</strong>
                  {currentDetails.technologies}
                </p>
              )}

              {!currentDetails && expanded.card.descBullets && (
                <section className="exp-expanded-section">
                  <h4>Highlights</h4>
                  <ul>
                    {expanded.card.descBullets.map((b, i) => (
                      <li
                        key={`hb-${i}`}
                        className={isDark ? "dark-mode-text" : ""}
                      >
                        {b}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {hasMedia && (
                <section className="exp-expanded-media-section">
                  {!hasGroupedMedia && (
                    <div
                      className={
                        "exp-expanded-media-grid " +
                        (mediaItems.length === 1
                          ? "exp-expanded-media-grid--single"
                          : "")
                      }
                    >
                      {mediaItems.map((item, index) => {
                        if (item.type === "video") {
                          return (
                            <div
                              key={item.key}
                              className="exp-expanded-media-item exp-expanded-media-item--video"
                            >
                              <div className="exp-expanded-video-wrapper">
                                <iframe
                                  src={youtubeEmbedUrl}
                                  title={
                                    currentDetails?.projectName ||
                                    expanded.card.company
                                  }
                                  frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                  loading="lazy"
                                />
                              </div>
                              {currentDetails?.youtubeUrl && (
                                <div className="exp-expanded-video-link">
                                  <a
                                    href={currentDetails.youtubeUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    Open this video on YouTube
                                  </a>
                                </div>
                              )}
                            </div>
                          );
                        }

                        return (
                          <div
                            key={item.key}
                            className="exp-expanded-media-item exp-expanded-media-item--image"
                          >
                          <img
                            src={item.src}
                            alt={
                              currentDetails?.projectName ||
                              `${expanded.card.company} screenshot ${index}`
                            }
                            loading="lazy"
                            onClick={() =>
                              handleOpenLightbox(
                                typeof item.imageIndex === "number"
                                  ? item.imageIndex
                                  : 0
                              )
                            }
                          />
                        </div>
                      );
                    })}
                    </div>
                  )}

                  {hasGroupedMedia && (
                    <>
                      {mediaGroups.map((group, groupIndex) => (
                        <div
                          key={`media-group-${groupIndex}`}
                          className="exp-expanded-section"
                        >
                          {group.title && <h4>{group.title}</h4>}
                          {group.details && group.details.length > 0 && (
                            <ul>
                              {group.details.map((item, idx) => (
                                <li
                                  key={`mg-${groupIndex}-${idx}`}
                                  className={isDark ? "dark-mode-text" : ""}
                                >
                                  {linkifyDetailText(
                                    item,
                                    `mg-${groupIndex}-${idx}`
                                  )}
                                </li>
                              ))}
                            </ul>
                          )}

                          {group.images && group.images.length > 0 && (
                            <div
                              className={
                                "exp-expanded-media-grid " +
                                (group.images.length === 1
                                  ? "exp-expanded-media-grid--single"
                                  : "")
                              }
                            >
                              {group.images.map((src, idx) => (
                                <div
                                  key={`mg-img-${groupIndex}-${idx}`}
                                  className="exp-expanded-media-item exp-expanded-media-item--image exp-expanded-media-item--image-with-caption"
                                >
                                  <img
                                    src={src}
                                    alt={
                                      currentDetails?.projectName ||
                                      `${expanded.card.company} screenshot ${idx}`
                                    }
                                    loading="lazy"
                                    onClick={() =>
                                      handleOpenLightbox(
                                        (groupImageOffsets[groupIndex] || 0) +
                                          idx
                                      )
                                    }
                                  />
                                  <button
                                    type="button"
                                    className="exp-expanded-image-caption"
                                    onClick={() =>
                                      handleOpenLightbox(
                                        (groupImageOffsets[groupIndex] || 0) +
                                          idx
                                      )
                                    }
                                  >
                                    Click to zoom image
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}

                      {youtubeEmbedUrl && (
                        <div className="exp-expanded-media-grid exp-expanded-media-grid--single">
                          <div className="exp-expanded-media-item exp-expanded-media-item--video">
                            {<h4>Gameplay Video</h4>}
                            <div className="exp-expanded-video-wrapper">
                              <iframe
                                src={youtubeEmbedUrl}
                                title={
                                  currentDetails?.projectName ||
                                  expanded.card.company
                                }
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                loading="lazy"
                              />
                            </div>
                            {currentDetails?.youtubeUrl && (
                              <div className="exp-expanded-video-link">
                                <a
                                  href={currentDetails.youtubeUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  Open this video on YouTube
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </section>
              )}
            </div>

            <button className="exp-expanded-close" onClick={handleCloseDetails}>
              x
            </button>
          </div>
        </>
      )}
      {lightboxIndex !== null && lightboxImages.length > 0 && (
        <div className="exp-lightbox" onClick={() => setLightboxIndex(null)}>
          <div
            className="exp-lightbox__content"
            onClick={(event) => event.stopPropagation()}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleMouseLeave}
          >
            <button
              type="button"
              className="exp-lightbox__nav exp-lightbox__nav--left"
              onClick={handlePrevImage}
              onMouseDown={(event) => event.stopPropagation()}
              onTouchStart={(event) => event.stopPropagation()}
            >
              ‹
            </button>
            <img
              src={lightboxImages[lightboxIndex]}
              alt="Expanded view"
              className="exp-lightbox__image"
            />
            <button
              type="button"
              className="exp-lightbox__nav exp-lightbox__nav--right"
              onClick={handleNextImage}
              onMouseDown={(event) => event.stopPropagation()}
              onTouchStart={(event) => event.stopPropagation()}
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
