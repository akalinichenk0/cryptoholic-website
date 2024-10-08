// Function to fetch global market data (Market Cap, Volume 24H, BTC & ETH Dominance)
async function fetchGlobalData() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/global');
        const data = await response.json();

        // Format market cap and volume
        const marketCap = `$${(data.data.total_market_cap.usd / 1e12).toFixed(2)}T`;
        const volume24h = `$${(data.data.total_volume.usd / 1e9).toFixed(2)}B`;
        const btcDominance = `${data.data.market_cap_percentage.btc.toFixed(2)}%`;
        const ethDominance = `${data.data.market_cap_percentage.eth.toFixed(2)}%`;

        // Update the HTML elements with the global data
        document.getElementById('marketCapValue').textContent = marketCap;
        document.getElementById('volume24hValue').textContent = volume24h;
        document.getElementById('btcDominanceValue').textContent = btcDominance;
        document.getElementById('ethDominanceValue').textContent = ethDominance;

    } catch (error) {
        console.error('Error fetching global market data:', error);
    }
}

// Function to fetch real-time data for crypto prices and percentage change
async function fetchCryptoPrices() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true');
        const data = await response.json();

        // Helper function to format the number conditionally
        function formatPrice(value) {
            return value % 1 === 0 
                ? value.toLocaleString('en-US', { minimumFractionDigits: 0 }) 
                : value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }

        // Helper function to format percentage change and add color with (1D) time frame
        function formatPriceChange(changeValue) {
            const formattedChange = changeValue.toFixed(2) + '% (1D)';
            return changeValue > 0
                ? `<span style="color: green">▲ ${formattedChange}</span>` // Up indicator
                : `<span style="color: red">▼ ${formattedChange}</span>`; // Down indicator
        }

        // Format the prices with commas and conditional decimals
        const btcPrice = formatPrice(data.bitcoin.usd);
        const ethPrice = formatPrice(data.ethereum.usd);
        const solPrice = formatPrice(data.solana.usd);

        // Fetch and format the price change percentages with the (1D) indicator
        const btcChange = formatPriceChange(data.bitcoin.usd_24h_change);
        const ethChange = formatPriceChange(data.ethereum.usd_24h_change);
        const solChange = formatPriceChange(data.solana.usd_24h_change);

        // Update the HTML elements with the formatted prices and price changes
        document.getElementById('btcPriceValue').textContent = `$${btcPrice}`;
        document.getElementById('btcPriceChange').innerHTML = btcChange;

        document.getElementById('ethPriceValue').textContent = `$${ethPrice}`;
        document.getElementById('ethPriceChange').innerHTML = ethChange;

        document.getElementById('solPriceValue').textContent = `$${solPrice}`;
        document.getElementById('solPriceChange').innerHTML = solChange;

    } catch (error) {
        console.error('Error fetching crypto prices:', error);
    }
}

// Function to fetch Fear & Greed Index
async function fetchFearGreedIndex() {
    try {
        const response = await fetch('https://api.alternative.me/fng/');
        const data = await response.json();

        // Check if data exists and update the UI
        if (data && data.data && data.data.length > 0) {
            const fearGreedValue = data.data[0].value;  // Get the latest value
            const fearGreedStatus = data.data[0].value_classification;  // Get the status

            // Update the HTML elements
            document.getElementById('fearGreedValue').textContent = fearGreedValue;
            document.getElementById('fearGreedStatus').textContent = fearGreedStatus;

            // Rotate the pointer based on the value (0 to 100)
            const pointerRotation = (fearGreedValue / 100) * 180 - 90; // Converts value to angle
            document.getElementById('gauge-pointer').style.transform = `rotate(${pointerRotation}deg)`;
        } else {
            throw new Error('Invalid data from API');
        }
    } catch (error) {
        console.error('Error fetching Fear & Greed Index:', error);
        document.getElementById('fearGreedValue').textContent = 'Error';
        document.getElementById('fearGreedStatus').textContent = 'Unavailable';
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

// Function to fetch the current GMT time and display it
function displayGMTTime() {
    const gmtElement = document.getElementById('gmtTime');
    const now = new Date();

    // Get the current GMT time in 24-hour format (HH:MM)
    const hours = String(now.getUTCHours()).padStart(2, '0'); // GMT hours
    const minutes = String(now.getUTCMinutes()).padStart(2, '0'); // GMT minutes

    // Format the time as GMT: HH:MM
    const gmtTimeFormatted = `GMT: ${hours}:${minutes}`;

    // Display the formatted GMT time
    gmtElement.textContent = gmtTimeFormatted;
}

// Call the functions after the page loads
window.onload = function() {
    updateDate();  // Update the date when the page loads
    fetchGlobalData();  // Fetch market overview data
    fetchCryptoPrices();  // Fetch live prices for Bitcoin, Ethereum, and Solana
    fetchFearGreedIndex();  // Fetch Fear & Greed Index data
    displayGMTTime();  // Display current GMT time

    // Optionally, refresh prices and time every 60 seconds
    setInterval(fetchGlobalData, 60000);
    setInterval(fetchCryptoPrices, 60000);
    setInterval(fetchFearGreedIndex, 60000);
    setInterval(displayGMTTime, 60000);  // Refresh GMT time every 60 seconds
};
