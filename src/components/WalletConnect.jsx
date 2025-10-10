import React, { useState } from 'react';
import { Wallet, Mail, Key, Github } from 'lucide-react';
import { initializeTurnkey } from '../services/turnkeyService';

const WalletConnect = ({ onConnect }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);

  const connectWithEmail = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setIsConnecting(true);
    setError(null);
    
    try {
      const turnkey = await initializeTurnkey();
      
      const authResponse = await turnkey.auth.email({
        email,
        targetPublicKey: process.env.REACT_APP_TURNKEY_ORG_ID,
      });

      if (authResponse.organizationId) {
        const wallet = await turnkey.wallet.create({
          organizationId: authResponse.organizationId,
          wallet: {
            walletName: `SYRA-${Date.now()}`,
            accounts: [
              {
                curve: 'CURVE_SECP256K1',
                pathFormat: 'PATH_FORMAT_BIP32',
                path: "m/44'/5757'/0'/0/0",
                addressFormat: 'ADDRESS_FORMAT_BITCOIN',
              },
            ],
          },
        });

        const address = wallet.addresses[0];
        
        localStorage.setItem('syra_wallet_address', address);
        localStorage.setItem('syra_wallet_org_id', authResponse.organizationId);
        
        onConnect({
          address,
          organizationId: authResponse.organizationId,
          provider: 'email',
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to connect wallet');
      console.error('Wallet connection error:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  const connectWithPasskey = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      const turnkey = await initializeTurnkey();
      
      const passkeyResponse = await turnkey.auth.passkey();

      if (passkeyResponse.organizationId) {
        const wallet = await turnkey.wallet.get({
          organizationId: passkeyResponse.organizationId,
        });

        const address = wallet.addresses[0];
        
        localStorage.setItem('syra_wallet_address', address);
        localStorage.setItem('syra_wallet_org_id', passkeyResponse.organizationId);
        
        onConnect({
          address,
          organizationId: passkeyResponse.organizationId,
          provider: 'passkey',
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to connect with passkey');
      console.error('Passkey connection error:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  const connectWithOAuth = async (provider) => {
    setIsConnecting(true);
    setError(null);

    try {
      const turnkey = await initializeTurnkey();
      
      const oauthUrl = turnkey.auth.getOAuthUrl({
        provider,
        redirectUri: `${window.location.origin}/oauth-callback`,
      });

      window.location.href = oauthUrl;
    } catch (err) {
      setError(err.message || 'Failed to initiate OAuth');
      console.error('OAuth error:', err);
      setIsConnecting(false);
    }
  };

  return (
    <div className="space-y-4">
      {!showEmailInput ? (
        <>
          <button
            onClick={() => setShowEmailInput(true)}
            disabled={isConnecting}
            className="w-full bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600 disabled:opacity-50 px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <Mail className="w-5 h-5" />
            <span>Connect with Email</span>
          </button>

          <button
            onClick={connectWithPasskey}
            disabled={isConnecting}
            className="w-full bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <Key className="w-5 h-5" />
            <span>Connect with Passkey</span>
          </button>

          <div className="flex space-x-2">
            <button
              onClick={() => connectWithOAuth('google')}
              disabled={isConnecting}
              className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-3 rounded-xl font-semibold transition-all duration-300"
            >
              Google
            </button>
            <button
              onClick={() => connectWithOAuth('github')}
              disabled={isConnecting}
              className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Github className="w-5 h-5" />
              <span>GitHub</span>
            </button>
          </div>
        </>
      ) : (
        <div className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500"
          />
          <div className="flex space-x-2">
            <button
              onClick={connectWithEmail}
              disabled={isConnecting || !email}
              className="flex-1 bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600 disabled:opacity-50 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
            >
              {isConnecting ? 'Connecting...' : 'Continue'}
            </button>
            <button
              onClick={() => setShowEmailInput(false)}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-semibold transition-all duration-300"
            >
              Back
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-3 text-red-400 text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default WalletConnect;
