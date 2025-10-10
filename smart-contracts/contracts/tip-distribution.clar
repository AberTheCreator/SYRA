```clarity
;; SYRA Tip Distribution Contract
;; Handles micro-tipping and tip splitting on Stacks blockchain

(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_UNAUTHORIZED (err u100))
(define-constant ERR_INSUFFICIENT_FUNDS (err u101))
(define-constant ERR_INVALID_AMOUNT (err u102))
(define-constant ERR_INVALID_RECIPIENT (err u103))

(define-data-var platform-fee-percentage uint u250)

(define-map tip-history
  { sender: principal, recipient: principal, tip-id: uint }
  {
    amount: uint,
    timestamp: uint,
    message: (optional (string-utf8 280))
  }
)

(define-map creator-stats
  principal
  {
    total-tips-received: uint,
    tip-count: uint,
    supporter-count: uint
  }
)

(define-data-var tip-counter uint u0)

(define-public (send-tip (recipient principal) (amount uint))
  (let
    (
      (sender tx-sender)
      (platform-fee (/ (* amount (var-get platform-fee-percentage)) u10000))
      (net-amount (- amount platform-fee))
      (tip-id (+ (var-get tip-counter) u1))
    )
    (asserts! (> amount u0) ERR_INVALID_AMOUNT)
    (asserts! (not (is-eq sender recipient)) ERR_INVALID_RECIPIENT)
    
    (try! (stx-transfer? platform-fee sender CONTRACT_OWNER))
    (try! (stx-transfer? net-amount sender recipient))
    
    (map-set tip-history
      { sender: sender, recipient: recipient, tip-id: tip-id }
      {
        amount: amount,
        timestamp: block-height,
        message: none
      }
    )
    
    (update-creator-stats recipient amount)
    (var-set tip-counter tip-id)
    
    (ok { tip-id: tip-id, net-amount: net-amount, platform-fee: platform-fee })
  )
)

(define-public (split-tip (recipients (list 10 principal)) (amounts (list 10 uint)))
  (let
    (
      (sender tx-sender)
      (total-amount (fold + amounts u0))
    )
    (asserts! (is-eq (len recipients) (len amounts)) ERR_INVALID_AMOUNT)
    (asserts! (> total-amount u0) ERR_INVALID_AMOUNT)
    
    (ok (map process-split-payment recipients amounts))
  )
)

(define-private (process-split-payment (recipient principal) (amount uint))
  (begin
    (unwrap-panic (stx-transfer? amount tx-sender recipient))
    (update-creator-stats recipient amount)
    true
  )
)

(define-private (update-creator-stats (creator principal) (amount uint))
  (let
    (
      (current-stats (default-to
        { total-tips-received: u0, tip-count: u0, supporter-count: u0 }
        (map-get? creator-stats creator)
      ))
    )
    (map-set creator-stats creator {
      total-tips-received: (+ (get total-tips-received current-stats) amount),
      tip-count: (+ (get tip-count current-stats) u1),
      supporter-count: (get supporter-count current-stats)
    })
  )
)

(define-read-only (get-creator-stats (creator principal))
  (ok (map-get? creator-stats creator))
)

(define-read-only (get-tip-details (sender principal) (recipient principal) (tip-id uint))
  (ok (map-get? tip-history { sender: sender, recipient: recipient, tip-id: tip-id }))
)

(define-public (set-platform-fee (new-fee uint))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_UNAUTHORIZED)
    (asserts! (<= new-fee u1000) ERR_INVALID_AMOUNT)
    (ok (var-set platform-fee-percentage new-fee))
  )
)
