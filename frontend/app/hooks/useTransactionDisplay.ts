import { useEffect } from 'react';

// Custom JSON serializer that handles BigInt
const customStringify = (obj: any): string => {
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'bigint') {
      return value.toString();
    }
    return value;
  }, 2);
};

export function useTransactionDisplay() {
  useEffect(() => {
    const handleTransaction = (event: CustomEvent) => {
      console.log("handling tx")
      console.log(event)
      const { transaction } = event.detail;
      console.log("pop up")
      console.log(event)
      
      // Create a new window
      const popup = window.open('', 'Transaction Details', 'width=800,height=600');
      if (!popup) return;

      // Write the HTML content
      popup.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Transaction Details</title>
            <style>
              body {
                background-color: #1a1a1a;
                color: white;
                font-family: system-ui, -apple-system, sans-serif;
                margin: 0;
                padding: 20px;
              }
              pre {
                background-color: #2a2a2a;
                padding: 16px;
                border-radius: 8px;
                overflow: auto;
                max-height: calc(100vh - 100px);
              }
              .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 16px;
              }
              .copy-button {
                background-color: #3a3a3a;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
              }
              .copy-button:hover {
                background-color: #4a4a4a;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>Transaction Details</h2>
              <button class="copy-button" onclick="copyToClipboard()">Copy</button>
            </div>
            <pre id="transaction-data">${customStringify(transaction)}</pre>
            <script>
              function copyToClipboard() {
                const text = document.getElementById('transaction-data').textContent;
                navigator.clipboard.writeText(text);
                const button = document.querySelector('.copy-button');
                button.textContent = 'Copied!';
                setTimeout(() => {
                  button.textContent = 'Copy';
                }, 2000);
              }
            </script>
          </body>
        </html>
      `);
    };

    window.addEventListener('showTransaction', handleTransaction as EventListener);
    return () => {
      window.removeEventListener('showTransaction', handleTransaction as EventListener);
    };
  }, []);
} 