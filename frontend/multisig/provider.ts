export class MultisigProvider {
  private popup: Window | null = null;
  private readonly ADDRESS_KEY = 'multisig_address';

  get address(): string | null {
    return localStorage.getItem(this.ADDRESS_KEY);
  }

  set address(value: string | null) {
    if (value) {
      localStorage.setItem(this.ADDRESS_KEY, value);
    } else {
      localStorage.removeItem(this.ADDRESS_KEY);
    }
  }

  cleanup() {
    this.address = null;
    if (this.popup && !this.popup.closed) {
      this.popup.close();
    }
    this.popup = null;
    localStorage.removeItem(this.ADDRESS_KEY)
  }

  async enable(chainId: string): Promise<void> {
    // Try to close any existing popup windows
    try {
      const existingPopup = window.open('', 'Multisig Address Input');
      if (existingPopup) {
        existingPopup.close();
      }
    } catch (e) {
      // Ignore errors from trying to access closed windows
    }

    // Create a popup window for address input
    this.popup = window.open('', 'Multisig Address Input', 'width=400,height=300');
    if (!this.popup) throw new Error('Popup blocked');

    // Create the popup content
    this.popup.document.write(`
      <html>
        <head>
          <style>
            body { 
              font-family: system-ui;
              padding: 20px;
              background: #1a1a1a;
              color: white;
            }
            input {
              width: 100%;
              padding: 8px;
              margin: 10px 0;
              background: #2a2a2a;
              border: 1px solid #3a3a3a;
              color: white;
              border-radius: 4px;
            }
            button {
              width: 100%;
              padding: 8px;
              background: #3a3a3a;
              border: none;
              color: white;
              border-radius: 4px;
              cursor: pointer;
            }
            button:hover {
              background: #4a4a4a;
            }
          </style>
        </head>
        <body>
          <h3>Enter Multisig Address</h3>
          <input type="text" id="address" placeholder="Enter multisig address">
          <button onclick="submitAddress()">Connect</button>
          <script>
            function submitAddress() {
              const address = document.getElementById('address').value;
              window.opener.postMessage({ type: 'MULTISIG_ADDRESS', address }, '*');
              window.close();
            }
          </script>
        </body>
      </html>
    `);

    // Listen for the address from the popup
    return new Promise((resolve, reject) => {
      const handleMessage = (event: MessageEvent) => {
        if (event.data.type === 'MULTISIG_ADDRESS') {
          this.address = event.data.address;
          console.log("address set: ", this.address)
          window.removeEventListener('message', handleMessage);
          resolve();
        }
      };
      window.addEventListener('message', handleMessage);
    });
  }

  getOfflineSignerOnlyAmino(chainId: string) {
    return {
      getAccounts: async () => {
        if (!this.address) throw new Error('No address set');
        return [{
          address: this.address,
          algo: 'secp256k1',
          pubkey: new Uint8Array(0) // We don't need the pubkey for multisig
        }];
      }
    };
  }
}
