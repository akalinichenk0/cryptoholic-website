// Function to fetch real-time data from CoinGecko API
async function fetchRealData() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/global');
        const data = await response.json();
        
        // Map the API response to your data structure
        return {
            marketCap: `$${(data.data.total_market_cap.usd / 1e12).toFixed(2)}T`,
            volume24h: `$${(data.data.total_volume.usd / 1e9).toFixed(2)}B`,
            btcDominance: `${data.data.market_cap_percentage.btc.toFixed(2)}%`,
            ethDominance: `${data.data.market_cap_percentage.eth.toFixed(2)}%`,
            fearGreedIndex: {
                value: 64, // Static for now (replace with a real API later if available)
                sentiment: "Greed"
            },
            altcoinSeasonIndex: {
                value: 0, // Static for now (replace with a real API later if available)
                sentiment: "Bitcoin Season"
            },
            topCryptos: [
                { name: "Bitcoin", price: "$65,714", change: "-0.29%" }, // Static
                { name: "Ethereum", price: "$2,677", change: "-0.92%" }, // Static
                { name: "Solana", price: "$156.73", change: "-0.98%" }   // Static
            ],
            additionalMetrics: {
                totalLiquidations: {
                    long: "$0.00", // Placeholder for future API
                    short: "$0.00" // Placeholder for future API
                },
                totalValueLocked: "$0.00", // Placeholder for future API
                networkHashRate: "0.58 TH/s", // Static
                transactionVolume: `$${(data.data.total_volume.usd / 1e9).toFixed(2)}B`
            }
        };
    } catch (error) {
        console.error('Error fetching data from API:', error);
        return null;
    }
}

// Function to update the DOM with fetched data
function updateDOM(data) {
    if (!data) {
        console.error('No data available to update the DOM');
        return;
    }

    // Market overview section
    document.querySelector(".box:nth-child(1) p").textContent = data.marketCap;
    document.querySelector(".box:nth-child(2) p").textContent = data.volume24h;
    document.querySelector(".box:nth-child(3) p").textContent = data.btcDominance;
    document.querySelector(".box:nth-child(4) p").textContent = data.ethDominance;

    // Sentiment indicators section
    document.querySelector(".box:nth-child(5) p").textContent = `${data.fearGreedIndex.value} (${data.fearGreedIndex.sentiment})`;
    document.querySelector(".box:nth-child(6) p").textContent = `${data.altcoinSeasonIndex.value} (${data.altcoinSeasonIndex.sentiment})`;

    // Top cryptos section
    const topCryptos = data.topCryptos;
    document.querySelector(".box:nth-child(7) p").textContent = `${topCryptos[0].price} (${topCryptos[0].change})`;
    document.querySelector(".box:nth-child(8) p").textContent = `${topCryptos[1].price} (${topCryptos[1].change})`;
    document.querySelector(".box:nth-child(9) p").textContent = `${topCryptos[2].price} (${topCryptos[2].change})`;

    // Additional metrics section
    document.querySelector(".box:nth-child(10) p").textContent = `Long: ${data.additionalMetrics.totalLiquidations.long}`;
    document.querySelector(".box:nth-child(10) p:nth-child(2)").textContent = `Short: ${data.additionalMetrics.totalLiquidations.short}`;
    document.querySelector(".box:nth-child(11) p").textContent = data.additionalMetrics.totalValueLocked;
    document.querySelector(".box:nth-child(12) p").textContent = data.additionalMetrics.networkHashRate;
    document.querySelector(".box:nth-child(13) p").textContent = data.additionalMetrics.transactionVolume;
}

// Fetch real data and update the DOM on page load
document.addEventListener('DOMContentLoaded', async function () {
    const realData = await fetchRealData(); // Fetch real data from the API
    updateDOM(realData);                    // Update the DOM with the data
});
