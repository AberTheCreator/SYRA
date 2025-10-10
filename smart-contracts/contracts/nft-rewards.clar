;; SYRA NFT Rewards Contract
;; Dynamic NFT rewards for top supporters

(define-non-fungible-token syra-supporter-nft uint)

(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_UNAUTHORIZED (err u200))
(define-constant ERR_NFT_EXISTS (err u201))
(define-constant ERR_NOT_FOUND (err u202))
(define-constant ERR_INVALID_TIER (err u203))

(define-data-var nft-counter uint u0)

(define-map nft-metadata
  uint
  {
    creator-id: uint,
    tier: (string-ascii 20),
    total-tips: uint,
    mint-date: uint,
    owner: principal
  }
)

(define-map user-nfts
  principal
  (list 100 uint)
)

(define-map creator-nft-config
  uint
  {
    bronze-threshold: uint,
    silver-threshold: uint,
    gold-threshold: uint,
    platinum-threshold: uint,
    diamond-threshold: uint
  }
)

(define-public (mint-reward (recipient principal) (creator-id uint) (total-tips uint))
  (let
    (
      (nft-id (+ (var-get nft-counter) u1))
      (tier (calculate-tier creator-id total-tips))
    )
    (try! (nft-mint? syra-supporter-nft nft-id recipient))
    
    (map-set nft-metadata nft-id {
      creator-id: creator-id,
      tier: tier,
      total-tips: total-tips,
      mint-date: block-height,
      owner: recipient
    })
    
    (update-user-nfts recipient nft-id)
    (var-set nft-counter nft-id)
    
    (ok nft-id)
  )
)

(define-public (upgrade-nft (nft-id uint) (new-total-tips uint))
  (let
    (
      (metadata (unwrap! (map-get? nft-metadata nft-id) ERR_NOT_FOUND))
      (owner (unwrap! (nft-get-owner? syra-supporter-nft nft-id) ERR_NOT_FOUND))
      (new-tier (calculate-tier (get creator-id metadata) new-total-tips))
    )
    (asserts! (is-eq tx-sender owner) ERR_UNAUTHORIZED)
    (asserts! (> new-total-tips (get total-tips metadata)) ERR_INVALID_TIER)
    
    (map-set nft-metadata nft-id (merge metadata {
      tier: new-tier,
      total-tips: new-total-tips
    }))
    
    (ok true)
  )
)

(define-private (calculate-tier (creator-id uint) (total-tips uint))
  (let
    (
      (config (default-to
        {
          bronze-threshold: u10,
          silver-threshold: u50,
          gold-threshold: u100,
          platinum-threshold: u500,
          diamond-threshold: u1000
        }
        (map-get? creator-nft-config creator-id)
      ))
    )
    (if (>= total-tips (get diamond-threshold config))
      "DIAMOND"
      (if (>= total-tips (get platinum-threshold config))
        "PLATINUM"
        (if (>= total-tips (get gold-threshold config))
          "GOLD"
          (if (>= total-tips (get silver-threshold config))
            "SILVER"
            "BRONZE"
          )
        )
      )
    )
  )
)

(define-private (update-user-nfts (user principal) (nft-id uint))
  (let
    (
      (current-nfts (default-to (list) (map-get? user-nfts user)))
    )
    (map-set user-nfts user (unwrap-panic (as-max-len? (append current-nfts nft-id) u100)))
  )
)

(define-read-only (get-nft-metadata (nft-id uint))
  (ok (map-get? nft-metadata nft-id))
)

(define-read-only (get-user-nfts (user principal))
  (ok (map-get? user-nfts user))
)

(define-public (set-creator-thresholds 
  (creator-id uint)
  (bronze uint)
  (silver uint)
  (gold uint)
  (platinum uint)
  (diamond uint))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_UNAUTHORIZED)
    (ok (map-set creator-nft-config creator-id {
      bronze-threshold: bronze,
      silver-threshold: silver,
      gold-threshold: gold,
      platinum-threshold: platinum,
      diamond-threshold: diamond
    }))
  )
)

(define-read-only (get-token-uri (nft-id uint))
  (ok (some (concat "https://api.syra.app/nft-metadata/" (int-to-ascii nft-id))))
)
