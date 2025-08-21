import type { components } from "../api/v1";

export type PersonCardProps = {
  person: components["schemas"]["Person"];
};

export const PersonCard = ({ person }: PersonCardProps) => {
  const [firstHobby, secondHobby, ...restHobbies] = person.hobbies ?? [];

  return (
    <article className="h-30 rounded-xl border-1 bg-white border-gray-300 dark:border-gray-600 dark:bg-gray-800">
      <div className="flex gap-4 p-6">
        <img
          src={person.avatar}
          alt={`${person.first_name} ${person.last_name}`}
          className="size-14 shrink-0 rounded-lg object-cover"
        />

        <div className="max-w-full overflow-hidden flex flex-col gap-2">
          <div>
            <h4
              className="overflow-hidden font-medium text-nowrap text-ellipsis"
              title={`${person.first_name} ${person.last_name}`}
            >
              {person.first_name} {person.last_name}
            </h4>

            <p className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
              <span className="overflow-hidden text-nowrap text-ellipsis" title={person.nationality}>
                {person.nationality}
              </span>
              <span className="overflow-hidden text-nowrap text-ellipsis" title={`${person.age} years old`}>
                {person.age}
              </span>
            </p>
          </div>

          <div className="flex place-items-center gap-2 text-sm">
            {firstHobby && (
              <span className="overflow-hidden text-nowrap text-ellipsis" title={firstHobby}>
                {firstHobby}
              </span>
            )}

            {secondHobby && (
              <span className="overflow-hidden text-nowrap text-ellipsis" title={secondHobby}>
                {secondHobby}
              </span>
            )}

            {restHobbies.length > 0 && (
              <span className="shrink-0" title={restHobbies.join(", ")}>
                (+{restHobbies.length})
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export const PersonCardSkeleton = () => (
  <article className="h-30 rounded-xl border-1 bg-white border-gray-300 dark:border-gray-600 dark:bg-gray-800 animate-pulse">
    <div className="flex gap-4 p-6">
      <div className="size-14 shrink-0 rounded-lg bg-gray-300 dark:bg-gray-600" />

      <div className="w-full overflow-hidden flex flex-col gap-2">
        <div>
          <div className="my-1 h-4 w-32 rounded bg-gray-300 dark:bg-gray-600" />
          <div className="my-1.5 h-4 w-24 rounded bg-gray-300 dark:bg-gray-600" />
        </div>

        <div className="h-4 w-40 rounded bg-gray-300 dark:bg-gray-600" />
      </div>
    </div>
  </article>
);
