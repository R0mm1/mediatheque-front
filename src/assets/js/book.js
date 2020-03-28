import {container} from 'tsyringe';
import RequestService from "../ts/service/RequestService";

const requestService = container.resolve(RequestService);

export default {
    downloadEBook: function (bookId) {
        let filename = 'book.epub'; //default file name

        const request = requestService.createRequest('/book/' + bookId + '/ebook');
        requestService.execute(request)
            .then(response => {

                //Retrieving file name from Content-Disposition Header
                let contentDisposition = response.headers.get('Content-Disposition');
                let filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                let matches = filenameRegex.exec(contentDisposition);
                if (matches != null && matches[1]) {
                    filename = matches[1].replace(/['"]/g, '');
                }

                return response.blob();
            })
            .then(blob => {
                //Trigger file download
                let file = new File([blob], filename);
                let objectUrl = URL.createObjectURL(file);
                window.open(objectUrl);
            })
            .catch(error => {
                alert('here ' + error);
            });
    },
    deleteBook(bookId) {
        const request = requestService.createRequest('/book/' + bookId, 'DELETE');
        return requestService.execute(request);
    }
}
