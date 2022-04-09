async function login() {
  let user = Moralis.User.current();
  if (!user) {
    user = await Moralis.authenticate();
  }

  Moralis.User.currentAsync().then(function(user) {
    let wallet = user.get('ethAddress');
    document.getElementById('address').innerHTML = wallet
  });
  console.log("logged in user:", user);
}

async function logOut() {
  await Moralis.User.logOut();
  document.getElementById('address').innerHTML = '';
  document.getElementById('container').innerHTML = '';
  console.log("logged out");
}

async function getNFTs() {
  let user = Moralis.User.current();
  if (!user) {
    await login();
    return;
  }

  let wallet = user.get('ethAddress');

  const options = { chain: "mumbai", address: wallet, token_address: "0x2a3C286446c790E1b573154b29be2D68a6AF6A1A" };
  const nfts = await Moralis.Web3API.account.getNFTsForContract(options);
  document.getElementById("container").innerHTML = '';

  nfts.result.forEach(nft => {
    console.log(nft);
    var div = document.createElement("div");
    div.classList.add("ticketContainer");

    var tokenId = document.createElement("h3");
    tokenId.innerHTML = "Ticket ID: " + nft.token_id;
    div.appendChild(tokenId);

    var img = document.createElement("img");
    img.classList.add("nftImage");
    img.src = nft.token_uri;
    div.appendChild(img);

    document.getElementById("container").appendChild(div);
  });
}
