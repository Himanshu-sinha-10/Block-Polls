var contract;
var owner;
var result = NaN;
var election_name;
var number_of_candidates;
var candidates = [];

var web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:8545");

const abi = [
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_pollName",
                "type": "string"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_candidate",
                "type": "string"
            }
        ],
        "name": "addCandidate",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_new_person",
                "type": "address"
            }
        ],
        "name": "authorize",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "candidates",
        "outputs": [
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "vote_count",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "end_polling",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "number_of_candidates",
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
        "name": "owner",
        "outputs": [
            {
                "internalType": "address payable",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "pollName",
        "outputs": [
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
        "name": "total_votes_polled",
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
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_index_of_candidate",
                "type": "uint256"
            }
        ],
        "name": "upvote",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "voters",
        "outputs": [
            {
                "internalType": "bool",
                "name": "authorized",
                "type": "bool"
            },
            {
                "internalType": "bool",
                "name": "voted",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "vote_to",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]
const address = "0xb65f6A04591155388e6E17f37D7e626257048138";

contract = new web3.eth.Contract(abi, address);

web3.eth.getAccounts().then((accounts) => {
    owner = accounts[0];
});

async function fetch() {
    result = await contract.methods.pollName().call();
    election_name = result;
    $("#ElectionName").html(election_name);


    result = await contract.methods.number_of_candidates().call();
    console.log(result);
    number_of_candidates = result;


    var helper;

    var helper_arr;
    var main_arr = [];


    async function fetch_candi() {

        for (var i = 0; i < number_of_candidates; i++) {
            helper = await contract.methods.candidates([i]).call();

            helper_arr = [];
            helper_arr.push(helper.name.toString());
            helper_arr.push(parseInt(helper.vote_count));
            main_arr.push(helper_arr);
        }


    }

    fetch_candi().then(() => {

        var label = ['Candidates', 'Votes'];
        main_arr.unshift(label);

        var test_arr = [['Candidates', 'Votes', { role: 'style' }],
        ['Ashhar', 1, '#b87333'],
        ['Saif', 3, 'silver']]

        google.charts.load('current', { 'packages': ['bar'] });
        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {
            var data = google.visualization.arrayToDataTable(main_arr);

            var options = {
                chart: {
                    title: election_name,

                }

            };

            var chart = new google.charts.Bar(document.getElementById('chart'));

            chart.draw(data, google.charts.Bar.convertOptions(options));


        }
    });
}

fetch();



$("#vote").click(function () {

    alert("Congrats!! your vote is counted. Refresh to view updated Results");
    var node_address = $("#pvtkey").val();
    var candidate_index = $("#votedto").val();

    contract.methods.authorize(node_address).send({ from: owner }).then(() => {
        contract.methods.upvote(candidate_index).send({ from: node_address }).then((receipt) => {
            console.log(receipt);
            window.location.reload();
        });
    });
});


