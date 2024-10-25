import ReactPlayer from "react-player";

export default function VideoPlayer({ url }: { url: string }) {

    return (
        <div className="border rounded-lg p-4 mb-4 shadow-lg">
            <ReactPlayer url={url}
                controls
                width="100%"
                height="100%"
                className="w-full h-full object-contain aspect-[16/9] mb-4"
                fallback={
                    <picture>
                        <img
                            src="https://via.placeholder.com/1280x720"
                            alt="Video"
                            className="w-full h-full object-contain"
                        />
                    </picture>
                }
                light={true}
                config={{
                    file: {
                        attributes: {
                            controlsList: "nodownload"
                        }
                    }
                }}
                loop={true}
                muted={true}
                style={{
                    borderRadius: "0.5rem"
                }}
            />
        </div>
    )
}