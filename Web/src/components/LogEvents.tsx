export const LogEvents = async (str: string, ...args: any) => {
    var logstr = args.toString();
    document.getElementById("log")!.innerHTML += str + " " + logstr + "\n";
};
