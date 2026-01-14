import Link from "next/link";

export default function VideoCard({ video }) {
  return (
    <div className="video-card">
      <div className="video-thumb">{video.duration}</div>
      <div className="video-meta">
        <h4>
          <Link href={`/videos/${video.id}`}>{video.title}</Link>
        </h4>
        <p>{video.description}</p>
        <div className="video-sub">
          <span>{video.channel}</span>
          <span>•</span>
          <span>{video.views} görüntülenme</span>
        </div>
      </div>
      <div className="video-actions">
        <button type="button">Beğen ({video.likes})</button>
        <Link href={`/videos/${video.id}`}>Detay</Link>
      </div>
    </div>
  );
}
