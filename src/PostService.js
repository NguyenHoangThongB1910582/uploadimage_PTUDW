import axios from 'axios';


const url = 'http://localhost:4000/api/posts/';
class PostService {
    //nhận
    static getPosts() {
        return new Promise ((resolve,reject) => {
            axios.get(url).then((res) => {
                const data = res.data;
                resolve(
                    data.map(post => ({
                        ...post,
                        createdAt: new Date(post.createdAt)
                    }))
                );
            })
            .catch((err)=> {
                reject(err);
            })
            
        });
    }
    // tạo
    static insertPost(text) {
        return axios.post(url,{
            text
        });
    }

    // xóa
    static deletePost(id) {
        return axios.delete(`${url}${id}`);
    }
}

export default PostService;
