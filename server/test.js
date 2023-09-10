import fetch from 'node-fetch';


// Define test users
const testUser = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  pseudo: "johndoe",
  password: "password"
};

let followerId = "some-follower-id";
const userId = "f216b31b-e753-47d3-8dee-ee94ee391d8b";
let postId = "some-post-id";
let commentId = "some-comment-id";

// Helper function to generate headers
const getHeaders = (token = null) => {
  let headers = {
    "Content-Type": "application/json"
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

// Register a user
const testRegister = async () => {
  try {
    const response = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(testUser)
    });
    

    const data = await response.json();
    followerId = data.id;
    console.log("Test Register : Passed Succesfully");
} catch (error) {
  console.log(error)
  console.log("Test Register: Not Passed");

}
};

// Check pseudo
const testCheckPseudo = async () => {
  try {
    const response = await fetch(`http://localhost:5000/check-pseudo/${testUser.pseudo}`);
    const data = await response.json();
    console.log("Test Check Pseudo: ", data);
  } catch (error) {
    console.log("Test Check Pseudo: Not Passed");
  }

};

// Check email
const testCheckEmail = async () => {
  try {
  const response = await fetch(`http://localhost:5000/check-email/${testUser.email}`);
  const data = await response.json();
  console.log("Test Check Email: ", data);
  } catch (error) {
    console.log("Test Check Email: Not Passed");

  }
};

// Follow a user
const testFollow = async () => {
  try {
  const response = await fetch(`http://localhost:5000/api/follow/${followerId}/${userId}`, {
    method: "PATCH",
    headers: getHeaders()
  });

  const data = await response.text();
  console.log("Test Follow: ", data);
  } catch (error) {
    console.log("Test Follow: Not Passed");
  }
};

// Unfollow a user
const testUnfollow = async () => {
  try {
  const response = await fetch(`http://localhost:5000/api/unfollow/${followerId}/${userId}`, {
    method: "PATCH",
    headers: getHeaders()
  });

  const data = await response.text();
  console.log("Test Unfollow: ", data);
  } catch (error) {
    console.log("Test Unfollow: Not Passed");
  } 
};

// Delete a user
const testDeleteUser = async () => {
  try {
  const response = await fetch(`http://localhost:5000/api/delete/${followerId}`, {
    method: "DELETE",
    headers: getHeaders()
  });

  const data = await response.json();
  console.log("Test Delete: Passed");
} catch (error) {
    console.log("Test Delete: Not Passed");
  }
};

// Login
const testLogin = async () => {
  try {
  const response = await fetch("http://localhost:5000/api/user/login", {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ pseudo: testUser.pseudo, password: testUser.password, rememberMe: false })
  });

  const data = await response.json();
  console.log("Test Login: Passed");

  } catch (error) {
    console.log(error);
    console.log("Test Login: Not Passed");
  }
};

const testLogout = async () => {
  try {
  // Make the fetch request
  const response = await fetch(`http://localhost:5000/api/user/logout/${followerId}`, {
    method: "GET",
  });

  // Parse and log the response
  const data = await response.json();
  
  console.log("Test Logout: ", data);}
  catch (error) {
    console.log(error)
    console.log("Test Logout: Not Passed");
  }
};

const testGetUsers = async () => {
  try {
  const response = await fetch("http://localhost:5000/users", {
    method: "GET"
  });

  const data = await response.json();
  console.log("Test Get Users Passed");
  } catch (error) {
    console.log(error);
    console.log("Test Get Users: Not Passed");
  }
};

const testCreatePost = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/post/createpost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: "Some description", username_id: followerId}),
    });

    const data = await response.json();
    postId = data.post.post_id
    console.log("Test Create Post :  Passed");

  } catch (error) {
    console.log("Test Create Post : Not Passed");
  }
};

const testCreateComment = async () => {
  try {
  const response = await fetch('http://localhost:5000/api/post/createcomment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ post_id: postId, username_id: followerId, description: "Some comment" }),
  });

  const data = await response.json();
  commentId = data.comment.comment_id;
  console.log("Test Create Comment: Passed");
} catch (error) {
  console.log("Test Create Comment: Not Passed");
}
};

const testDeletePost = async () => {
  try {
  const response = await fetch('http://localhost:5000/api/post/deletepost', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ post_id: postId }),
  });

  const data = await response.json();
  console.log("Test Delete Post: Passed");
} catch {
  console.log("Test Delete Post: Not Passed")
}
};

const testDeleteComment = async () => {
  try {
  const response = await fetch('http://localhost:5000/api/post/deletecomment', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ post_id: postId, comment_id: commentId }),
  });

  const data = await response.json();
  console.log("Test Delete Comment: Passed");

} catch (error) {
  console.log("Test Delete Comment: Not Passed");
}
};

const testHandleLikePost = async () => {
  try {
  const response = await fetch('http://localhost:5000/api/post/handlelikepost', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ post_id: postId, username_id: followerId }),
  });

  const data = await response.json();
  console.log("Test Handle Like Post:  Passed");

} catch (error) {
  console.log("Test Handle Like Post: Not Passed");
}
};


const testHandleLikeComment = async () => {
  try {
  const response = await fetch('http://localhost:5000/api/post/handlelikecomment', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ post_id: "somePostId", comment_id: "someCommentId", username_id: "1" }),
  });

  const data = await response.json();
  console.log("Test Handle Like Post: Passed");

} catch (error) {
  console.log("Test Handle Like Post: Not Passed");
}
};

const testGetPostById = async () => {
  try {
  const response = await fetch(`http://localhost:5000/api/postbyid/${followerId}`);
  const data = await response.json();
  console.log("Test Get Post by ID: Passed")
  } catch (error) {
    console.log("Test Get Post by ID: Not Passed")
  }
};

const testGetFeed = async () => {
  try {
  const response = await fetch(`http://localhost:5000/api/post/feed/${followerId}`);
  const data = await response.json();
  console.log("Test Get Feed: Passed")

  } catch (error) {
    console.log("Test Get Feed: Not Passed")
  }
};

const testGetComments = async () => {
  try {
  const response = await fetch(`http://localhost:5000/api/post/${postId}/comments`);
  const data = await response.json();
  console.log("Test Get Comments: Passed")

  } catch (error) {
    console.log("Test Get Comments: Not Passed")
  }
};


const testGetStoriesById = async () => {
  try {
  const response = await fetch(`http://localhost:5000/api/story/getstories/${followerId}`);
  const data = await response.json();
  console.log("Test Get Stories by Id: Passed");

  } catch (error) {
    console.log("Test Get Stories by Id: Not Passed");
  }
};


const testGetAllStories = async () => {
  try {
  const response = await fetch(`http://localhost:5000/api/story/getallstories`);
  const data = await response.json();
  console.log("Test Get All Stories: Passed");

  } catch (error) {
    console.log("Test Get All Stories: Not Passed");
  }
};


const testDeleteStories = async () => {
  try {
  const response = await fetch(`http://localhost:5000/api/story/deletestories/${followerId}`, {
    method: 'DELETE',
  });
  const data = await response.json();
  console.log("Test Delete Story: Passed");

} catch (error) {
  console.log("Test Delete Story: Not Passed");

}
};

const testAddStories = async () => {
  const payload = {
    user_id: followerId,
    image: 'image1',
  };
  try {
  const response = await fetch(`http://localhost:5000/api/story/addstories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  console.log("Test Add Story: Passed");

} catch (error) {
  console.log("Test Add Story: Not Passed");

}
};













// Test cases sequence
const runTests = async () => {
  await testRegister();
  await testCheckPseudo();
  await testCheckEmail();
  await testFollow();
  await testUnfollow();
  await testLogin();
  await testLogout();
  await testGetUsers();
  await testCreatePost();
  await testCreateComment();
  await testHandleLikePost();
  await testHandleLikeComment();
  await testGetComments();
  await testDeleteComment();
  await testDeletePost();
  await testGetPostById();
  await testGetFeed();
  await testAddStories();
  await testGetStoriesById();
  await testGetAllStories();
  await testDeleteStories();
  await testDeleteUser();
};

// Run all tests
runTests();
