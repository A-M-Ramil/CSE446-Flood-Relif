

let web3;
let contract;
  
const contractABI = [
  {
    "inputs": [],
    "name": "ERROR__COLLECTOR__CANT__BE__A__DONATOR",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ERROR__Donor__Not__Registered",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ERROR__INVALID__FUND__ZONE",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ERROR__NOT__ENOUGH__BALANCE",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ERROR__NOT__ENOUGH__SENT__VALUE",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "accountNo",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "chittagongNorthCollector",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "chittagongSouthCollector",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "sylhetCollector",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_mobileNum",
        "type": "string"
      }
    ],
    "name": "registerDonor",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_mobile",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_fundZone",
        "type": "string"
      }
    ],
    "name": "donate",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_add",
        "type": "address"
      }
    ],
    "name": "getDonor",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getDonationAmountSylhet",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getDonationAmountChittagongSouth",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getDonationAmountChittagongNorth",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalDonation",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }];
const contractAddress = "0xcE7C76a3A4Caa62DcF8c01822808De5a398A33C9"; // Replace with your deployed contract address

async function connectWallet() {
  try {
      if (window.ethereum) {
          web3 = new Web3(window.ethereum);
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          if (accounts.length > 0) {
              document.getElementById("walletAddress").textContent = "Connected: " + accounts[0];
          } else {
              alert("No accounts found.");
          }
      } else {
          alert("MetaMask is not installed.");
      }
  } catch (error) {
      console.error("Error connecting wallet:", error);
  }
}

// Initialize Contract
function initializeContract() {
  if (web3) {
      contract = new web3.eth.Contract(contractABI, contractAddress);
  } else {
      alert("Web3 not initialized.");
  }
}
// Register Donor
async function registerDonor(event) {
    event.preventDefault(); // Prevent form submission refresh
    const name = document.getElementById("name").value;
    const mobileNum = document.getElementById("mobileNum").value;

    initializeContract();

    try {
        const accounts = await web3.eth.getAccounts();
        if (accounts.length > 0) {
            const tx = await contract.methods.registerDonor(name, mobileNum).send({ from: accounts[0] });
            alert("Donor registered successfully!");
        } else {
            alert("No accounts found. Please connect your wallet.");
        }
    } catch (error) {
        console.error("Error registering donor", error);
        alert("Error registering donor: " + error.message); // Debugging: Show error message
    }
}

// Donate function
async function donate(event) {
    event.preventDefault(); // Prevent form submission refresh
    const mobile = document.getElementById("mobile").value;
    const fundZone = document.getElementById("fundZone").value;

    initializeContract();

    try {
        const accounts = await web3.eth.getAccounts();
        if (accounts.length > 0) {
            const tx = await contract.methods.donate(mobile, fundZone).send({ 
                from: accounts[0], 
                value: web3.utils.toWei("0.01", "ether") 
            });
            alert("Donation successful!");
        } else {
            alert("No accounts found. Please connect your wallet.");
        }
    } catch (error) {
        console.error("Error during donation", error);
        alert("Error during donation: " + error.message);  // Debugging: Show error message
    }
}

// Get total donations and display for each zone
async function getDonations() {
    initializeContract();

    try {
        const total = await contract.methods.getTotalDonation().call();
        const sylhet = await contract.methods.getDonationAmountSylhet().call();
        const chittagongSouth = await contract.methods.getDonationAmountChittagongSouth().call();
        const chittagongNorth = await contract.methods.getDonationAmountChittagongNorth().call();

        // Display donation info
        document.getElementById("donationsInfo").textContent = 
            `Total: ${web3.utils.fromWei(total, "ether")} ETH, 
            Sylhet: ${web3.utils.fromWei(sylhet, "ether")} ETH, 
            Chittagong South: ${web3.utils.fromWei(chittagongSouth, "ether")} ETH, 
            Chittagong North: ${web3.utils.fromWei(chittagongNorth, "ether")} ETH`;

        alert("Donations fetched successfully!");  // Debugging: Confirm data fetched
    } catch (error) {
        console.error("Error fetching donations", error);
        alert("Error fetching donations: " + error.message);  // Debugging: Show error message
    }
}

// Event listeners for buttons and forms
document.getElementById("connectWallet").addEventListener("click", connectWallet);
document.getElementById("donorRegistrationForm").addEventListener("submit", registerDonor);
document.getElementById("donationForm").addEventListener("submit", donate);
document.getElementById("getDonations").addEventListener("click", getDonations);