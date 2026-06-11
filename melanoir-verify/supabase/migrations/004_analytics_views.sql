-- Phase C: 집계 뷰 (service_role 전용 조회 — admin 페이지에서만 사용)

-- 수집 퍼널
CREATE OR REPLACE VIEW mnr_v_funnel AS
SELECT
  (SELECT COUNT(*) FROM mnr_procedures)                                              AS procedures,
  (SELECT COUNT(*) FROM mnr_registrations)                                           AS registrations,
  (SELECT COUNT(*) FROM mnr_registrations WHERE photo_url IS NOT NULL)               AS before_photos,
  (SELECT COUNT(*) FROM mnr_registrations WHERE healing_photo_url IS NOT NULL)       AS healing_photos,
  (SELECT COUNT(*) FROM mnr_registrations WHERE longterm_photo_url IS NOT NULL)      AS longterm_photos,
  (SELECT ROUND(AVG(satisfaction), 2) FROM mnr_registrations)                        AS avg_satisfaction;

-- 로트별 품질 (만족도·불편 신고)
CREATE OR REPLACE VIEW mnr_v_lot_quality AS
SELECT
  p.lot_id,
  COUNT(r.reg_id)                                  AS registrations,
  ROUND(AVG(r.satisfaction), 2)                    AS avg_satisfaction,
  COUNT(*) FILTER (
    WHERE r.discomfort IS NOT NULL
      AND array_length(r.discomfort, 1) > 0
      AND NOT ('none' = ANY(r.discomfort))
  )                                                AS discomfort_count
FROM mnr_registrations r
JOIN mnr_products p ON p.serial_token = r.serial_token
GROUP BY p.lot_id
ORDER BY p.lot_id;

-- 기법·부위별 만족도
CREATE OR REPLACE VIEW mnr_v_technique_quality AS
SELECT
  pr.technique,
  pr.area,
  pr.is_retouch,
  COUNT(r.reg_id)               AS registrations,
  ROUND(AVG(r.satisfaction), 2) AS avg_satisfaction
FROM mnr_procedures pr
LEFT JOIN mnr_registrations r ON r.serial_token = pr.serial_token
GROUP BY pr.technique, pr.area, pr.is_retouch
ORDER BY pr.technique, pr.area;
