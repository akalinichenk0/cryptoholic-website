// Function to fetch real-time data from CoinGecko API
async function fetchRealData() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/global');
        const data = await response.json();
        
        // Map the API response to your data structure
        const cryptoData = {
            marketCap: `$${(data.data.total_market_cap.usd / 1e12).toFixed(2)}T`,
            volume24h: `$${(data.data.total_volume.usd / 1e9).toFixed(2)}B`,
            btcDominance: `${data.data.market_cap_percentage.btc.toFixed(2)}%`,
            ethDominance: `${data.data.market_cap_percentage.eth.toFixed(2)}%`
        };

        // Update the HTML elements with the fetched data
        document.getElementById('marketCapValue').textContent = cryptoData.marketCap;
        document.getElementById('volume24hValue').textContent = cryptoData.volume24h;
        document.getElementById('btcDominanceValue').textContent = cryptoData.btcDominance;
        document.getElementById('ethDominanceValue').textContent = cryptoData.ethDominance;

    } catch (error) {
        console.error('Error fetching data from API:', error);
    }
}

// Function to update the date dynamically
function updateDate() {
    const dateElement = document.getElementById("date");
    const today = new Date();
    const options = { month: 'long', day: 'numeric' };
    const formattedDate = today.toLocaleDateString('en-US', options);
    
    dateElement.textContent = formattedDate;
}

// Call the functions after the page loads
window.onload = function() {
    updateDate();  // Update the date when the page loads
    fetchRealData();  // Fetch crypto data when the page loads

    // Optionally, fetch data every 60 seconds (live updates)
    setInterval(fetchRealData, 60000);
};

// Function to fetch real-time data for crypto prices
async function fetchCryptoPrices() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd');
        const data = await response.json();

        // Helper function to format the number conditionally
        function formatPrice(value) {
            // Check if the value is a whole number
            return value % 1 === 0 
                ? value.toLocaleString('en-US', { minimumFractionDigits: 0 }) 
                : value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }

        // Format the prices with commas and conditional decimals
        const btcPrice = formatPrice(data.bitcoin.usd);
        const ethPrice = formatPrice(data.ethereum.usd);
        const solPrice = formatPrice(data.solana.usd);

        // Update the HTML elements with the formatted prices
        document.getElementById('btcPriceValue').textContent = `$${btcPrice}`;
        document.getElementById('ethPriceValue').textContent = `$${ethPrice}`;
        document.getElementById('solPriceValue').textContent = `$${solPrice}`;

    } catch (error) {
        console.error('Error fetching crypto prices:', error);
    }
}

// Call the functions after the page loads
window.onload = function() {
    updateDate();  // Update the date when the page loads
    fetchRealData();  // Fetch market overview data
    fetchCryptoPrices();  // Fetch live prices for Bitcoin, Ethereum, and Solana

    // Optionally, fetch data every 60 seconds for live updates
    setInterval(fetchCryptoPrices, 60000);
};
