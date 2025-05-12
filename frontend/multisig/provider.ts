export class MultisigProvider {
  private address: string | null = null;
  private popup: Window | null = null;
  private readonly POPUP_KEY = 'multisig_popup_open';

  async enable(chainId: string): Promise<void> {
    // Check if popup is already open from a previous session
    if (localStorage.getItem(this.POPUP_KEY)) {
      localStorage.removeItem(this.POPUP_KEY);
    }

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

    // Mark popup as open
    localStorage.setItem(this.POPUP_KEY, 'true');

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
              window.opener.localStorage.removeItem('multisig_popup_open');
              window.close();
            }
            // Clean up if popup is closed without submitting
            window.onbeforeunload = function() {
              window.opener.localStorage.removeItem('multisig_popup_open');
            };
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
