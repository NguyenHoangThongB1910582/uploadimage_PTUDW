const express = require("express")
const auth = require("./auth")
var fileSystem = require("fs")
const ObjectId = require("mongodb").ObjectId
 
module.exports = {
    init: function (app) {
        const self = this
        const router = express.Router()
        
        

        router.post("/", auth, async function (request, result) {
            const user = request.user
         
            let searchObj = {
                "createdBy._id": user._id
            }
         
            if (user.role == "representative") {
                searchObj = {}
            }
            const perPage = 4
 
    const total = await global.db.collection("tickets").countDocuments(searchObj)
    const pageNumber = request.fields.page ?? 1
    const pages = Math.ceil(total / perPage)

    const startFrom = (pageNumber - 1) * perPage
         
            const tickets = await global.db.collection("tickets").find(searchObj)
            .skip(startFrom)
            .limit(perPage)
            .sort({ updatedAt: -1 })
            .toArray()    
         
            result.json({
                status: "success",
                message: "Data has been fetched.",
                tickets: tickets,
                pages: pages,
                pageNumber: parseInt(pageNumber)
            })
        })

        // đăng tải 
        router.post("/create", auth, async function (request, result) {
            const user = request.user
            const title = request.fields.title
            const description = request.fields.description
            
            if (!title || !description) {
                result.json({
                    status: "error",
                    message: "Please enter all values."
                })
         
                return
            }
            
         
            const images = []
            if (Array.isArray(request.files.images)) {
                for (let a = 0; a < request.files.images.length; a++) {
                    images.push(request.files.images[a])
                }
            } else {
                images.push(request.files.images)
            }
         
            self.callbackFileUpload(images, 0, [], async function (savedPaths) {
                const ticketObj = {
                    _id: ObjectId(),
                    title: title,
                    description: description,
                    screenshots: savedPaths,
                    createdBy: {
                        _id: user._id,
                        name: user.name
                    },
                    status: "Done", 
                    replies: [],
                    createdAt: new Date().getTime(),
                    updatedAt: new Date().getTime()
                }
         
                await global.db.collection("tickets").insertOne(ticketObj)
         
                result.json({
                    status: "success",
                    message: "Done.",
                    ticket: ticketObj
                })
            })
        })
        
        app.use("/tickets", router)
    },
    callbackFileUpload: function(images, index, savedPaths = [], success = null) {
        const self = this
        
        if (typeof images.length > index) {
            if ( images[index].size == 0) {
                index++
                self.callbackFileUpload(images, index, savedPaths, success)
            } else {
                fileSystem.readFile(images[index].path, function (error, data) {
                    if (error) {
                        console.error(error)
                        return
                    }
     
                    const filePath = "uploads/" + new Date().getTime() + "-" + images[index].name
     
                    fileSystem.writeFile(filePath, data, async function (error) {
                        if (error) {
                            console.error(error)
                            return
                        }
     
                        savedPaths.push({
                            _id: ObjectId(),
                            name: images[index].name,
                            path: filePath
                        })
     
                        if (index == (images.length - 1)) {
                            success(savedPaths)
                        } else {
                            index++
                            self.callbackFileUpload(images, index, savedPaths, success)
                        }
                    })
     
                    fileSystem.unlink(images[index].path, function (error) {
                        if (error) {
                            console.error(error)
                            return
                        }
                    })
                })
            }
        }  else {
            success(savedPaths)
        }
    }}