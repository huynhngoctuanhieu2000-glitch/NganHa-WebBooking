// AboutStory.tsx - Our Story / About Section (Canva-style editorial layout)
'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { aboutTexts } from './AboutStory.i18n';
import {
  sectionVariants,
  titleVariants,
  introVariants,
  cardVariants,
} from './AboutStory.animation';

// 🔧 UI CONFIGURATION
const SECTION_MAX_WIDTH = '1400px';
const IMAGE_BORDER_RADIUS = '12px';
const BG_OVERLAY_OPACITY = 0.88;
const VIEWPORT_THRESHOLD = 0.1;

const GALLERY_IMAGES = [
  { src: '/images/about-cruise.png', caption: 'Buổi tối trên Saigon Princess' },
  { src: '/images/about-treatment.png', caption: 'Bấm huyệt chân tại Ngân Hà' },
  { src: '/images/about-street.png', caption: 'Tham quan thành phố dưới Saigon Waterbus' },
];

const AboutStory = () => {
  const t = aboutTexts.vi;

  return (
    <section id="about" className="about-section">
      {/* Background */}
      <div className="about-bg">
        <div
          className="about-bg-image"
          style={{ backgroundImage: 'url(/images/about-bg.png)' }}
        />
        <div
          className="about-bg-overlay"
          style={
            { '--about-overlay': BG_OVERLAY_OPACITY } as React.CSSProperties
          }
        />
      </div>

      {/* Content */}
      <motion.div
        className="about-content"
        style={{ maxWidth: SECTION_MAX_WIDTH }}
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: VIEWPORT_THRESHOLD }}
      >
        {/* ═══ HEADER: Brand + Our Story ═══ */}
        <motion.div className="about-header" variants={titleVariants}>
          <div className="about-header-brand">
            <span className="about-header-system">Hệ thống</span>
            <h2 className="about-header-name">
              Ngân Hà
              <br />
              <span className="about-header-sub">Barbershop &amp; Spa</span>
            </h2>
          </div>
          <h2 className="about-header-title">Our Story</h2>
        </motion.div>

        {/* ═══ MAIN: 2-column editorial ═══ */}
        <div className="about-editorial">
          {/* LEFT COLUMN: Text content */}
          <motion.div className="about-editorial-text" variants={introVariants}>
            {/* Section 1: Vị Trí Vàng */}
            <h3 className="about-heading-gold">Vị Trí Vàng và Kết Nối</h3>

            <div className="about-bullet-group">
              <div className="about-bullet">
                <span className="about-bullet-dot" />
                <p>
                  <em className="about-highlight">Tọa lạc</em> ngay bên sông
                  Sài Gòn, khu vực đường Ngô Đức Kế, Quận 1 là một trong những
                  tuyến phố có vị trí đắc địa và mang tính biểu tượng cao tại
                  trung tâm Thành phố Hồ Chí Minh.
                </p>
              </div>

              <div className="about-bullet">
                <span className="about-bullet-dot" />
                <p>
                  <em className="about-highlight">Vị trí Chiến lược:</em> Đường
                  Ngô Đức Kế nằm trọn vẹn tại Phường Sài Gòn, Quận 1, khu vực
                  trung tâm kinh tế và thương mại của thành phố. Tuyến đường có
                  chiều dài khoảng 403m, lưu thông hai chiều.
                </p>
              </div>

              <div className="about-bullet">
                <span className="about-bullet-dot" />
                <p>
                  <em className="about-highlight">Kết nối quan trọng:</em> Đường
                  Ngô Đức Kế kéo dài và giao cắt với các trục đường
                  &ldquo;vàng&rdquo; khác của Quận 1, tạo nên một tam giác kinh
                  doanh sầm uất:
                </p>
              </div>

              <ul className="about-sub-list">
                <li>
                  Nối từ Công Trường Mê Linh (gần sông Sài Gòn và tượng Trần
                  Hưng Đạo).
                </li>
                <li>
                  Cắt ngang đường Đồng Khởi (trục đường thương mại xa xỉ).
                </li>
                <li>
                  Cắt ngang Đường Nguyễn Huệ (Phố đi bộ, trung tâm sự kiện).
                </li>
                <li>
                  Kết thúc tại đường Hồ Tùng Mậu (trục đường ngân hàng, tài
                  chính).
                </li>
              </ul>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Images */}
          <motion.div className="about-editorial-images" variants={cardVariants}>
            <div
              className="about-image-main"
              style={{ borderRadius: IMAGE_BORDER_RADIUS }}
            >
              <Image
                src="/images/about-street.png"
                alt="Đường Ngô Đức Kế, Quận 1"
                width={600}
                height={450}
                style={{ objectFit: 'cover', borderRadius: IMAGE_BORDER_RADIUS }}
              />
            </div>
          </motion.div>
        </div>

        {/* ═══ SECOND ROW: Architecture + Atmosphere ═══ */}
        <div className="about-editorial about-editorial--reverse">
          {/* LEFT: Atmosphere */}
          <motion.div className="about-editorial-text" variants={cardVariants}>
            <h3 className="about-heading-gold">Không khí và phong cách</h3>

            <div className="about-bullet-group">
              <div className="about-bullet">
                <span className="about-bullet-dot about-bullet-dot--morning" />
                <p>
                  <em className="about-highlight">Buổi sáng:</em> Nhiều quán cà
                  phê, tiệm bánh, cửa hàng thời trang sang trọng. Rất nhiều dân
                  văn phòng và du khách ghé qua.
                </p>
              </div>

              <div className="about-bullet">
                <span className="about-bullet-dot about-bullet-dot--evening" />
                <p>
                  <em className="about-highlight">Buổi tối:</em> Đèn đường, ánh
                  sáng từ các quán bar nhỏ, rooftop, và dòng người từ Nguyễn Huệ
                  tạo nên không khí trẻ trung, hiện đại và năng động.
                </p>
              </div>

              <div className="about-bullet">
                <span className="about-bullet-dot" />
                <p>
                  Đây cũng là nơi thường xuyên được chọn làm địa điểm check-in
                  do có nhiều góc chụp &ldquo;Tây&rdquo; và sang chảnh.
                </p>
              </div>
            </div>

            <h3 className="about-heading-gold" style={{ marginTop: '28px' }}>
              Đặc Sản Địa Phương
            </h3>
            <div className="about-bullet-group">
              <div className="about-bullet">
                <span className="about-bullet-dot" />
                <p>
                  Bên cạnh những trải nghiệm thị giác và ẩm thực du khách không
                  nên bỏ lỡ mà nhất định phải thử qua hoạt động phục hồi cơ
                  thể. Đó chính là{' '}
                  <em className="about-highlight">
                    bấm huyệt chân và Aroma toàn thân
                  </em>{' '}
                  được thực hiện bằng đôi bàn tay của các nghệ nhân kết hợp với
                  xông hơi khô, nơi mọi giác quan được đánh thức, một tách trà
                  nóng, một âm điệu spa du dương — đó là linh hồn của sự trải
                  nghiệm mà Hệ Thống Ngân Hà Barbershop &amp; Spa luôn hướng
                  đến.
                </p>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: More images */}
          <motion.div className="about-editorial-images" variants={cardVariants}>
            <div
              className="about-image-main"
              style={{ borderRadius: IMAGE_BORDER_RADIUS }}
            >
              <Image
                src="/images/about-cruise.png"
                alt="Du thuyền sông Sài Gòn"
                width={600}
                height={450}
                style={{ objectFit: 'cover', borderRadius: IMAGE_BORDER_RADIUS }}
              />
            </div>
          </motion.div>
        </div>

        {/* ═══ FILM STRIP GALLERY ═══ */}
        <motion.div className="about-filmstrip" variants={cardVariants}>
          <div className="about-filmstrip-track">
            {GALLERY_IMAGES.map((img, idx) => (
              <div key={idx} className="about-filmstrip-frame">
                <div className="about-filmstrip-holes about-filmstrip-holes--top">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <span key={i} className="about-filmstrip-hole" />
                  ))}
                </div>
                <div className="about-filmstrip-img">
                  <Image
                    src={img.src}
                    alt={img.caption}
                    width={320}
                    height={200}
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <p className="about-filmstrip-caption">{img.caption}</p>
                <div className="about-filmstrip-holes about-filmstrip-holes--bottom">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <span key={i} className="about-filmstrip-hole" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default AboutStory;
