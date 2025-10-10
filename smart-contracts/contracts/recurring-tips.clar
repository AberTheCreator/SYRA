;; SYRA Recurring Tips Contract
;; Automated recurring tip payments

(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_UNAUTHORIZED (err u300))
(define-constant ERR_INVALID_FREQUENCY (err u301))
(define-constant ERR_INSUFFICIENT_BALANCE (err u302))
(define-constant ERR_NOT_FOUND (err u303))
(define-constant ERR_ALREADY_EXISTS (err u304))

(define-data-var recurring-tip-counter uint u0)

(define-map recurring-tips
  uint
  {
    sender: principal,
    recipient: principal,
    amount: uint,
    frequency-blocks: uint,
    last-payment-block: uint,
    active: bool,
    total-payments: uint
  }
)

(define-map user-recurring-tips
  principal
  (list 50 uint)
)

(define-public (setup-recurring-tip (recipient principal) (amount uint) (frequency-blocks uint))
  (let
    (
      (tip-id (+ (var-get recurring-tip-counter) u1))
      (sender tx-sender)
    )
    (asserts! (> amount u0) ERR_INVALID_FREQUENCY)
    (asserts! (> frequency-blocks u0) ERR_INVALID_FREQUENCY)
    (asserts! (not (is-eq sender recipient)) ERR_UNAUTHORIZED)
    
    (map-set recurring-tips tip-id {
      sender: sender,
      recipient: recipient,
      amount: amount,
      frequency-blocks: frequency-blocks,
      last-payment-block: block-height,
      active: true,
      total-payments: u0
    })
    
    (update-user-recurring-tips sender tip-id)
    (var-set recurring-tip-counter tip-id)
    
    (ok tip-id)
  )
)

(define-public (execute-recurring-tip (tip-id uint))
  (let
    (
      (tip-data (unwrap! (map-get? recurring-tips tip-id) ERR_NOT_FOUND))
      (sender (get sender tip-data))
      (recipient (get recipient tip-data))
      (amount (get amount tip-data))
      (frequency (get frequency-blocks tip-data))
      (last-payment (get last-payment-block tip-data))
    )
    (asserts! (get active tip-data) ERR_UNAUTHORIZED)
    (asserts! (>= (- block-height last-payment) frequency) ERR_INVALID_FREQUENCY)
    
    (try! (as-contract (stx-transfer? amount sender recipient)))
    
    (map-set recurring-tips tip-id (merge tip-data {
      last-payment-block: block-height,
      total-payments: (+ (get total-payments tip-data) u1)
    }))
    
    (ok true)
  )
)

(define-public (cancel-recurring-tip (tip-id uint))
  (let
    (
      (tip-data (unwrap! (map-get? recurring-tips tip-id) ERR_NOT_FOUND))
    )
    (asserts! (is-eq tx-sender (get sender tip-data)) ERR_UNAUTHORIZED)
    
    (ok (map-set recurring-tips tip-id (merge tip-data { active: false })))
  )
)

(define-public (pause-recurring-tip (tip-id uint))
  (let
    (
      (tip-data (unwrap! (map-get? recurring-tips tip-id) ERR_NOT_FOUND))
    )
    (asserts! (is-eq tx-sender (get sender tip-data)) ERR_UNAUTHORIZED)
    
    (ok (map-set recurring-tips tip-id (merge tip-data { active: false })))
  )
)

(define-public (resume-recurring-tip (tip-id uint))
  (let
    (
      (tip-data (unwrap! (map-get? recurring-tips tip-id) ERR_NOT_FOUND))
    )
    (asserts! (is-eq tx-sender (get sender tip-data)) ERR_UNAUTHORIZED)
    
    (ok (map-set recurring-tips tip-id (merge tip-data { active: true })))
  )
)

(define-private (update-user-recurring-tips (user principal) (tip-id uint))
  (let
    (
      (current-tips (default-to (list) (map-get? user-recurring-tips user)))
    )
    (map-set user-recurring-tips user (unwrap-panic (as-max-len? (append current-tips tip-id) u50)))
  )
)

(define-read-only (get-recurring-tip (tip-id uint))
  (ok (map-get? recurring-tips tip-id))
)

(define-read-only (get-user-recurring-tips (user principal))
  (ok (map-get? user-recurring-tips user))
)

(define-read-only (is-payment-due (tip-id uint))
  (match (map-get? recurring-tips tip-id)
    tip-data
      (ok (and
        (get active tip-data)
        (>= (- block-height (get last-payment-block tip-data)) (get frequency-blocks tip-data))
      ))
    (err ERR_NOT_FOUND)
  )
)
