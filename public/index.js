// Your code here

//fetch cat img from cat api

async function getNewCat() {
  const options = {
    headers: {
      "x-api-key":
        "live_6tF7FAFnRgoWExxL7a0BGsHN4iFHVp5bmt8TaNgKMvL6jRIbtrPnQcGZqPtgoe9S",
    },
    method: "GET",
  };
  const response = await fetch(
    "https://api.thecatapi.com/v1/images/search?limit=1&has_breeds=1",
    options
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const cats = await response.json();

  return cats[0];
}

// MAKE CAT DIVS--------------------------------------------------------------------

async function setNewCat(id, container, cat) {
  if (!cat) {
    cat = await getNewCat();
  }

  //   create html div and img block
  const catWrapper = document.createElement("div");
  catWrapper.classList.add("cat-wrapper");

  // BUTTONS FOR WHO IS HOTTER---------------------
  const button = document.createElement("button");
  button.classList.add("cat-button");
  button.id = `cat-button-${id}`;
  button.innerText = "This one loses👇";

  button.addEventListener("click", async () => {
    await setNewCat(id, container);
  });
  // IMG-------------------------------
  const catImgWrapper = document.createElement("div");
  catImgWrapper.classList.add("cat-img-wrapper");

  const catImg = document.createElement("img");
  catImg.alt = "cat";
  catImg.src = cat.url;
  catImg.classList.add("cat-img");

  // caption & description-------------------------------------------

  const catCaptionWrapper = document.createElement("div");
  catCaptionWrapper.classList.add("cat-caption-wrapper");

  const catCaption = document.createElement("h2");
  catCaption.innerText = `Breed: ${cat.breeds[0].name}`;
  catCaption.classList.add("cat-caption");

  // votes div
  const votesWrapper = document.createElement("div");
  votesWrapper.classList.add("votes-wrapper");

  let totalVotes = 0;

  const totalVotesP = document.createElement("p");
  //set total votes to local storage if cat has a totalvotes
  totalVotesP.classList.add("total-votes-p");
  if (cat.totalVotes) {
    totalVotesP.innerText = cat.totalVotes;
  } else {
    totalVotesP.innerText = totalVotes;
  }

  //upvote
  const upVote = document.createElement("button");
  upVote.classList.add("up-vote");
  upVote.innerText = "👆";
  upVote.addEventListener("click", () => {
    totalVotes += 1;
    totalVotesP.innerText = totalVotes;
    const catObj = JSON.parse(localStorage.getItem(`cat${id}`));
    catObj.totalVotes = totalVotes;
    console.log(catObj);
    localStorage.setItem(`cat${id}`, JSON.stringify(catObj));
  });

  //downVote
  const downVote = document.createElement("button");
  downVote.classList.add("down-vote");
  downVote.innerText = "👇";
  downVote.addEventListener("click", () => {
    totalVotes -= 1;
    totalVotesP.innerText = totalVotes;
    const catObj = JSON.parse(localStorage.getItem(`cat${id}`));
    catObj.totalVotes = totalVotes;
    localStorage.setItem(`cat${id}`, JSON.stringify(catObj));
  });
  votesWrapper.append(totalVotesP, upVote, downVote);
  catCaptionWrapper.append(catCaption, votesWrapper);

  //COMMENTS------------------------------
  const commentsWrapper = document.createElement("div");
  commentsWrapper.classList.add("comments-wrapper");

  const newCommentWrapper = document.createElement("new-comment-wrapper");
  newCommentWrapper.classList.add("new-comment-wrapper");

  const textInput = document.createElement("textarea");
  textInput.classList.add("text-input");
  textInput.rows = 2;
  textInput.cols = 30;

  const submitButton = document.createElement("button");
  submitButton.classList.add("submit-button");
  submitButton.innerText = "add comment";
  newCommentWrapper.append(textInput, submitButton);
  commentsWrapper.append(newCommentWrapper);

  let numComments;
  if (cat.comments instanceof Array) {
    if (cat.comments.length > 0) {
      cat.comments.forEach((comment) => {
        const setComment = document.createElement("p");
        setComment.innerText = comment;
        commentsWrapper.append(setComment);
        textInput.value = "";
      });
      numComments = cat.comments.length;
    }
  } else {
    cat.comments = [];
    // store the cat with it's container---------------------------
    numComments = 0;
  }

  localStorage.setItem(`cat${id}`, JSON.stringify(cat));

  submitButton.addEventListener("click", () => {
    if (textInput.value) {
      const comment = textInput.value;
      numComments += 1;
      //  get cat from local storage -- JSON.parse it-- add new comment and numComments
      const catObj = JSON.parse(localStorage.getItem(`cat${id}`));
      catObj.comments.push(comment);
      catObj.numComments = numComments;
      localStorage.setItem(`cat${id}`, JSON.stringify(catObj));

      const setComment = document.createElement("p");
      setComment.innerText = comment;
      commentsWrapper.append(setComment);
      textInput.value = "";
    }
  });

  //   append stuff-----------------------------------------
  catImgWrapper.append(catImg);
  catWrapper.append(button, catImgWrapper, catCaptionWrapper, commentsWrapper);
  container.innerHTML = "";
  container.append(catWrapper);
}

// INITIALIZE PAGE ------------------------------------------------------------------
// ------------------------------------------------------------------------------------
async function initializePage() {
  // HEADER
  const header = document.createElement("header");
  header.classList.add("header");
  // MAIN
  const main = document.createElement("main");
  main.classList.add("main");

  const catDivWrapper = document.createElement("div");
  catDivWrapper.classList.add("cat-div-wrapper");

  const catContainer1 = document.createElement("div");
  const catContainer2 = document.createElement("div");

  catDivWrapper.append(catContainer1, catContainer2);

  if (localStorage.getItem("cat1")) {
    const cat = JSON.parse(localStorage.getItem("cat1"));
    await setNewCat(1, catContainer1, cat);
  } else {
    await setNewCat(1, catContainer1);
  }

  if (localStorage.getItem("cat2")) {
    const cat = JSON.parse(localStorage.getItem("cat2"));
    await setNewCat(2, catContainer2, cat);
  } else {
    await setNewCat(2, catContainer2);
  }

  main.append(catDivWrapper);

  const footer = document.createElement("footer");
  window.document.body.append(header, main, footer);
}

window.addEventListener("DOMContentLoaded", (e) => {
  initializePage();
});
