interface CastMember {
    name: string;
    character: string;
    photo: string;
}

interface Props {
    cast: CastMember[];
}

export function CastMembers({ cast }: Props) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {cast.map((member, index) => (
                <div key={index} className="text-center">
                    <div className="aspect-square overflow-hidden rounded-full mb-3 border-2 border-gray-800">
                        <img
                            src={member.photo}
                            alt={member.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <h4 className="font-medium text-white">{member.name}</h4>
                    <p className="text-sm text-gray-400">{member.character}</p>
                </div>
            ))}
        </div>
    );
}
