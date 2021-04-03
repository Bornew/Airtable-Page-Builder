export default function(htmlPromise: any) {
    Promise.resolve(htmlPromise).then((value) => console.log(value));
}