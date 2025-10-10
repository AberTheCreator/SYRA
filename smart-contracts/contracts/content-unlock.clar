;; SYRA Content Unlock Contract
;; Unlock premium content based on tip thresholds

(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_UNAUTHORIZED (err u400))
(define-constant ERR_NOT_FOUND (err u401))
(define-constant ERR_THRESHOLD_NOT_MET (err u402))

(define-map content-access
  { creator: principal, content-id: uint }
  {
    unlock-threshold: uint,
    content-uri: (string-utf8 256),
    active: bool
  }
)

(define-map user-access
  { user: principal, creator: principal, content-id: uint }
  {
    unlocked: bool,
    unlock-date: uint,
    total-tips: uint
  }
)

(define-map creator-tip-totals
  { user: principal, creator: principal }
  uint
)

(define-public (register-content (content-id uint) (unlock-threshold uint) (content-uri (string-utf8 256)))
  (begin
    (map-set content-access
      { creator: tx-sender, content-id: content-id }
      {
        unlock-threshold: unlock-threshold,
        content-uri: content-uri,
        active: true
      }
    )
    (ok true)
  )
)

(define-public (record-tip-for-unlock (creator principal) (amount uint))
  (let
    (
      (current-total (default-to u0 (map-get? creator-tip-totals { user: tx-sender, creator: creator })))
      (new-total (+ current-total amount))
    )
    (map-set creator-tip-totals
      { user: tx-sender, creator: creator }
      new-total
    )
    (ok new-total)
  )
)

(define-public (unlock-content (creator principal) (content-id uint))
  (let
    (
      (content (unwrap! (map-get? content-access { creator: creator, content-id: content-id }) ERR_NOT_FOUND))
      (user-tips (default-to u0 (map-get? creator-tip-totals { user: tx-sender, creator: creator })))
    )
    (asserts! (>= user-tips (get unlock-threshold content)) ERR_THRESHOLD_NOT_MET)
    (asserts! (get active content) ERR_UNAUTHORIZED)
    
    (map-set user-access
      { user: tx-sender, creator: creator, content-id: content-id }
      {
        unlocked: true,
        unlock-date: block-height,
        total-tips: user-tips
      }
    )
    
    (ok (get content-uri content))
  )
)

(define-read-only (check-access (user principal) (creator principal) (content-id uint))
  (ok (map-get? user-access { user: user, creator: creator, content-id: content-id }))
)

(define-read-only (get-user-tip-total (user principal) (creator principal))
  (ok (map-get? creator-tip-totals { user: user, creator: creator }))
)

(define-read-only (get-content-details (creator principal) (content-id uint))
  (ok (map-get? content-access { creator: creator, content-id: content-id }))
)
