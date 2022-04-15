const ABI = [{'inputs':[],'stateMutability':'nonpayable','type':'constructor'},{'anonymous':false,'inputs':[{'indexed':true,'internalType':'address','name':'owner','type':'address'},{'indexed':true,'internalType':'address','name':'approved','type':'address'},{'indexed':true,'internalType':'uint256','name':'tokenId','type':'uint256'}],'name':'Approval','type':'event'},{'anonymous':false,'inputs':[{'indexed':true,'internalType':'address','name':'owner','type':'address'},{'indexed':true,'internalType':'address','name':'operator','type':'address'},{'indexed':false,'internalType':'bool','name':'approved','type':'bool'}],'name':'ApprovalForAll','type':'event'},{'anonymous':false,'inputs':[{'indexed':true,'internalType':'address','name':'from','type':'address'},{'indexed':true,'internalType':'address','name':'to','type':'address'},{'indexed':true,'internalType':'uint256','name':'tokenId','type':'uint256'}],'name':'Transfer','type':'event'},{'inputs':[{'internalType':'address','name':'to','type':'address'},{'internalType':'uint256','name':'tokenId','type':'uint256'}],'name':'approve','outputs':[],'stateMutability':'nonpayable','type':'function'},{'inputs':[{'internalType':'address','name':'owner','type':'address'}],'name':'balanceOf','outputs':[{'internalType':'uint256','name':'','type':'uint256'}],'stateMutability':'view','type':'function'},{'inputs':[{'internalType':'uint256','name':'tokenId','type':'uint256'}],'name':'getApproved','outputs':[{'internalType':'address','name':'','type':'address'}],'stateMutability':'view','type':'function'},{'inputs':[{'internalType':'address','name':'owner','type':'address'},{'internalType':'address','name':'operator','type':'address'}],'name':'isApprovedForAll','outputs':[{'internalType':'bool','name':'','type':'bool'}],'stateMutability':'view','type':'function'},{'inputs':[{'internalType':'address','name':'buyer','type':'address'}],'name':'mintTicket','outputs':[{'internalType':'uint256','name':'','type':'uint256'}],'stateMutability':'payable','type':'function'},{'inputs':[],'name':'name','outputs':[{'internalType':'string','name':'','type':'string'}],'stateMutability':'view','type':'function'},{'inputs':[{'internalType':'uint256','name':'tokenId','type':'uint256'}],'name':'ownerOf','outputs':[{'internalType':'address','name':'','type':'address'}],'stateMutability':'view','type':'function'},{'inputs':[{'internalType':'address','name':'from','type':'address'},{'internalType':'address','name':'to','type':'address'},{'internalType':'uint256','name':'tokenId','type':'uint256'}],'name':'safeTransferFrom','outputs':[],'stateMutability':'nonpayable','type':'function'},{'inputs':[{'internalType':'address','name':'from','type':'address'},{'internalType':'address','name':'to','type':'address'},{'internalType':'uint256','name':'tokenId','type':'uint256'},{'internalType':'bytes','name':'_data','type':'bytes'}],'name':'safeTransferFrom','outputs':[],'stateMutability':'nonpayable','type':'function'},{'inputs':[{'internalType':'address','name':'operator','type':'address'},{'internalType':'bool','name':'approved','type':'bool'}],'name':'setApprovalForAll','outputs':[],'stateMutability':'nonpayable','type':'function'},{'inputs':[{'internalType':'bytes4','name':'interfaceId','type':'bytes4'}],'name':'supportsInterface','outputs':[{'internalType':'bool','name':'','type':'bool'}],'stateMutability':'view','type':'function'},{'inputs':[],'name':'symbol','outputs':[{'internalType':'string','name':'','type':'string'}],'stateMutability':'view','type':'function'},{'inputs':[{'internalType':'uint256','name':'tokenId','type':'uint256'}],'name':'tokenURI','outputs':[{'internalType':'string','name':'','type':'string'}],'stateMutability':'view','type':'function'},{'inputs':[{'internalType':'address','name':'from','type':'address'},{'internalType':'address','name':'to','type':'address'},{'internalType':'uint256','name':'tokenId','type':'uint256'}],'name':'transferFrom','outputs':[],'stateMutability':'nonpayable','type':'function'}];
const CHAIN = 'mumbai';
const CONTRACT = '0x2a3C286446c790E1b573154b29be2D68a6AF6A1A'

async function login() {
  let user = Moralis.User.current();
  if (!user) {
    user = await Moralis.authenticate();
  }

  Moralis.User.currentAsync().then(function(user) {
    let wallet = user.get('ethAddress');
    document.getElementById('address').innerHTML = wallet
  });
  console.log('logged in user:', user);
}

async function logOut() {
  await Moralis.User.logOut();
  document.getElementById('address').innerHTML = '';
  document.getElementById('container').innerHTML = '';
  console.log('logged out');
}

async function getNFTs() {
  let wallet = await getWallet();

  const options = { chain: CHAIN, address: wallet, token_address: CONTRACT};
  const nfts = await Moralis.Web3API.account.getNFTsForContract(options);
  document.getElementById('container').innerHTML = '';

  nfts.result.forEach(nft => {
    console.log(nft);
    let div = document.createElement('div');
    div.classList.add('ticketContainer');

    let tokenId = document.createElement('h3');
    tokenId.innerHTML = 'Ticket ID: ' + nft.token_id;
    div.appendChild(tokenId);

    let img = document.createElement('img');
    img.classList.add('nftImage');
    img.src = nft.token_uri;
    div.appendChild(img);

    div.appendChild(document.createElement('br'));

    let sendBtn = document.createElement('button');
    sendBtn.innerHTML = 'Send'
    sendBtn.addEventListener('click', function(){
      sendTicket(nft.token_id);
    });
    div.appendChild(sendBtn);

    document.getElementById('container').appendChild(div);
  });
}

async function mintTicket(){
  let wallet = await getWallet();
  let web3 = new Web3(window.ethereum);
  let price = Moralis.Units.Token('0.1', '18')
  let contract_instance = new web3.eth.Contract(ABI, CONTRACT);
  await contract_instance.methods
    .mintTicket(wallet)
    .send({value: price, from: wallet});
}

async function sendTicket(ticketId) {
  let receiver_address = prompt("Please enter receiver address", "0x4F1256D7B3B10a82e48d3982bbC586C532BBe860");

  const options = {
    type: 'erc721',
    receiver: receiver_address,
    contract_address: CONTRACT,
    token_id: ticketId
  };
  await Moralis.authenticate();
  await Moralis.enableWeb3();
  let result = await Moralis.transfer(options);
  console.log(result);
}

async function getWallet() {
  let user = Moralis.User.current();
  if (!user) {
    await login();
    return;
  }
  return user.get('ethAddress');
}
