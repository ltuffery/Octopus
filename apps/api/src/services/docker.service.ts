import * as Docker from 'dockerode';

const docker = new Docker({ socketPath: '/var/run/docker.sock' });

export class DockerService {
    // ─── Containers ───────────────────────────────────────────

    async listContainers(all = true) {
        return docker.listContainers({ all });
    }

    async getContainer(id: string) {
        return docker.getContainer(id);
    }

    async createContainer(options: Docker.ContainerCreateOptions) {
        return docker.createContainer(options);
    }

    async startContainer(id: string) {
        const container = docker.getContainer(id);
        return container.start();
    }

    async stopContainer(id: string) {
        const container = docker.getContainer(id);
        return container.stop();
    }

    async restartContainer(id: string) {
        const container = docker.getContainer(id);
        return container.restart();
    }

    async removeContainer(id: string, force = false) {
        const container = docker.getContainer(id);
        return container.remove({ force });
    }

    async inspectContainer(id: string) {
        return docker.getContainer(id).inspect();
    }

    async getContainerLogs(id: string, tail = 100): Promise<string> {
        const container = docker.getContainer(id);
        const stream = await container.logs({
            stdout: true,
            stderr: true,
            tail,
            timestamps: true,
        });
        return stream.toString('utf-8');
    }

    async getContainerStats(id: string) {
        const container = docker.getContainer(id);
        return container.stats({ stream: false });
    }

    // ─── Images ───────────────────────────────────────────────

    async listImages() {
        return docker.listImages();
    }

    async pullImage(image: string): Promise<void> {
        return new Promise((resolve, reject) => {
            docker.pull(image, (err: Error, stream: NodeJS.ReadableStream) => {
                if (err) return reject(err);

                docker.modem.followProgress(stream, (err, result) => {
                    if (err) return reject(err);
                    resolve();
                });
            });
        });
    }

    async removeImage(id: string, force = false) {
        const image = docker.getImage(id);
        return image.remove({ force });
    }

    async imageExists(name: string): Promise<boolean> {
        try {
            await docker.getImage(name).inspect();
            return true;
        } catch {
            return false;
        }
    }

    // ─── Networks ─────────────────────────────────────────────

    async listNetworks() {
        return docker.listNetworks();
    }

    async createNetwork(name: string, options?: Docker.NetworkCreateOptions) {
        return docker.createNetwork({ Name: name, ...options });
    }

    async removeNetwork(id: string) {
        const network = docker.getNetwork(id);
        return network.remove();
    }

    async networkExists(name: string): Promise<boolean> {
        const networks = await docker.listNetworks();
        return networks.some(n => n.Name === name);
    }

    // ─── Volumes ──────────────────────────────────────────────

    async listVolumes() {
        return docker.listVolumes();
    }

    async createVolume(name: string) {
        return docker.createVolume({ Name: name });
    }

    async removeVolume(name: string) {
        const volume = docker.getVolume(name);
        return volume.remove();
    }

    // ─── Ping ─────────────────────────────────────────────────

    async ping(): Promise<boolean> {
        try {
            await docker.ping();
            return true;
        } catch {
            return false;
        }
    }

    async info() {
        return docker.info();
    }
}