'use client'

import AgoraRTC, {
  AgoraRTCProvider,
  LocalVideoTrack,
  RemoteUser,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRTCClient,
  useRemoteAudioTracks,
  useRemoteUsers,
} from 'agora-rtc-react'
import Link from 'next/link'

function Call({ channelName }: { channelName: string }) {
  const client = useRTCClient(
    AgoraRTC.createClient({ codec: 'vp8', mode: 'rtc' }),
  )

  return (
    <AgoraRTCProvider client={client}>
      <Videos
        channelName={channelName}
        AppID={process.env.PUBLIC_AGORA_APP_ID!}
      />
      <div className='fixed z-10 bottom-0 left-0 right-0 flex justify-center pb-4'>
        <Link
          className='px-5 py-3 text-base font-medium text-center text-white bg-tg-accent-color rounded-lg focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900 w-auto'
          href='/'>
          Завершить звонок
        </Link>
      </div>
    </AgoraRTCProvider>
  )
}

function Videos(props: { channelName: string; AppID: string }) {
  const { AppID, channelName } = props
  const { isLoading: isLoadingMic, localMicrophoneTrack } =
    useLocalMicrophoneTrack()
  const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack()
  const remoteUsers = useRemoteUsers()
  const { audioTracks } = useRemoteAudioTracks(remoteUsers)

  usePublish([localMicrophoneTrack, localCameraTrack])
  useJoin({
    appid: AppID,
    channel: channelName,
    token: null,
  })

  audioTracks.map(track => track.play())
  const deviceLoading = isLoadingMic || isLoadingCam
  if (deviceLoading)
    return (
      <div className='flex flex-col items-center pt-40'>Loading devices...</div>
    )
  const unit = 'minmax(0, 1fr) '

  return (
    <div className='flex flex-col justify-between w-full h-screen p-1'>
      <div
        className={`grid  gap-1 flex-1`}
        style={{
          gridTemplateColumns:
            remoteUsers.length > 9
              ? unit.repeat(4)
              : remoteUsers.length > 4
                ? unit.repeat(3)
                : remoteUsers.length > 1
                  ? unit.repeat(2)
                  : unit,
        }}>
        <LocalVideoTrack
          track={localCameraTrack}
          play={true}
          className='w-full h-full'
        />
        {remoteUsers.map(user => (
          <RemoteUser key={user.uid} user={user} />
        ))}
      </div>
    </div>
  )
}

export default Call
